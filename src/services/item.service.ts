import { Inject, Service } from 'typedi';
import { skinPortConfig } from '../config/skin-port.config';
import { Currency } from '../model/item.model';
import { RedisProvider, SkinPortProvider } from '../providers';
import { mapTradableAndNonTradablePrices } from '../utils/item-price-mapper';
import { LoggerService } from './';
import { ItemsSyncService } from './items-sync.service';

@Service()
export class ItemService {
  constructor(
    @Inject(() => SkinPortProvider) private skinPortProvider: SkinPortProvider,
    @Inject(() => RedisProvider) private redisProvider: RedisProvider,
    private itemsSyncService: ItemsSyncService,
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

    await this.itemsSyncService.storeSkinPortItems(mergedPricesItems);

    if (mergedPricesItems.length) {
      await this.redisProvider.set(cacheKey, JSON.stringify(mergedPricesItems), skinPortConfig.cacheTTL);
    }

    return mergedPricesItems;
  }
}
