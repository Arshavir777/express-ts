import { HttpError, NotFoundError } from 'routing-controllers';
import { Sql } from 'postgres';
import { Service } from 'typedi';
import { CreatePurchaseDTO, PurchaseDTO } from '../dto';
import { UserRepository, ItemRepository, PurchaseRepository } from '../repositories';
import { User } from '../model';
import { PostgresDataSource } from '../datasources';

@Service()
export class PurchaseService {
  constructor(
    protected purchaseRepository: PurchaseRepository,
    protected itemRepository: ItemRepository,
    protected userRepository: UserRepository,
    protected dataSource: PostgresDataSource
  ) { }

  async createPurchase(currentUser: User, purchaseData: PurchaseDTO): Promise<number> {

    const { itemId, isTradable, quantity } = purchaseData;
    const item = await this.itemRepository.findById(purchaseData.itemId);

    if (!item) {
      throw new NotFoundError('Item not found');
    }

    if (item.quantity < quantity) {
      throw new HttpError(429, 'Insufficient item quantity');
    }

    const price = isTradable ? item.tradable_price : item.non_tradable_price;
    const totalPrice = price * quantity;

    const db = this.dataSource.getConnection();

    const dto = new CreatePurchaseDTO(
      itemId,
      currentUser.id,
      quantity,
      totalPrice,
      isTradable
    )

    await db.begin(async (tx: Sql) => {
      await this.purchaseRepository.createPurchase(tx, dto);
      await this.itemRepository.decreaseQuantity(tx, itemId, quantity);
      await this.userRepository.decreaseBalance(tx, currentUser.id, totalPrice);
    });

    const user = await this.userRepository.findById(currentUser.id);

    return user?.balance || 0;
  }
}
