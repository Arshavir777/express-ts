import { Inject, Service } from 'typedi';
import { skinPortConfig } from '../config/skin-port.config';
import { Currency } from '../model/item.model';
import { RedisProvider, SkinPortProvider } from '../providers';
import { mapTradableAndNonTradablePrices } from '../utils/item-price-mapper';
import { LoggerService } from './';
import { ItemRepository } from '../repositories';
import { FindItemsDTO } from '../dto';
import createSkinPortItemsSyncQueue from '../jobs/sync-api-items.job';

@Service()
export class ItemService {
  constructor(
    // Experiential
    @Inject(() => SkinPortProvider) private skinPortProvider: SkinPortProvider,
    @Inject(() => RedisProvider) private redisProvider: RedisProvider,
    private itemRepository: ItemRepository,
    private logger: LoggerService
  ) { }

  async getSkinPortItems(appId: number, currency: Currency = Currency.EUR) {

    const cacheKey = `skin-port-items:${appId}:${currency}`;

    this.logger.logInfo(`ItemService@getSkinPortItems: cacheKey:${cacheKey}`)

    const cachedSkinPortItems = await this.redisProvider.get(cacheKey);

    if (cachedSkinPortItems) {
      return JSON.parse(cachedSkinPortItems);
    }

    const [skinPortItems, skinPortNonTradableItems] = await Promise.all([
      this.skinPortProvider.fetchItems(appId, currency, true),
      this.skinPortProvider.fetchItems(appId, currency, false)
    ]);

    if (!skinPortItems.length) {
      return [];
    }

    const mergedPricesItems = mapTradableAndNonTradablePrices(skinPortItems, skinPortNonTradableItems, appId);

    if (mergedPricesItems.length) {
      await this.redisProvider.set(cacheKey, JSON.stringify(mergedPricesItems), skinPortConfig.cacheTTL);

      // Send to queue
      createSkinPortItemsSyncQueue().add({ cacheKey })
    }

    return mergedPricesItems;
  }

  async getItems(params: FindItemsDTO) {
    return this.itemRepository.findAll(params)
  }


  test() {
    return 200;
  }
}
