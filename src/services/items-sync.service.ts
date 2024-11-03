import { Service } from 'typedi';
import { LoggerService } from './';
import { arrayToChunks } from '../utils';
import { ItemRepository } from '../repositories';
import { CreateItemDTO } from '../dto';

@Service()
export class ItemsSyncService {
    constructor(
        private logger: LoggerService,
        private itemRepository: ItemRepository
    ) { }

    async storeSkinPortItems(skinPortItems: CreateItemDTO[]) {

        const chunks = arrayToChunks<CreateItemDTO>(skinPortItems, 1000);
        this.logger.logInfo(`ItemsSyncService@storeSkinPortItems chunks size: ${chunks.length}`);

        for (const chunk of chunks) {
            const count = await this.itemRepository.bulkCreate(chunk);
            if (count) {
                this.logger.logInfo(`ItemsSyncService@storeSkinPortItems=>inserted: ${count} items`);
            }
        }
    }
}
