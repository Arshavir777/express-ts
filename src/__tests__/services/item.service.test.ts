// Required for TypeDI to work with decorators
import 'reflect-metadata';
import Container from 'typedi';
import Bull from 'bull';
import { ItemService, LoggerService } from '../../services';
import { createMockInstance } from '../../utils/test.utils';
import { RedisProvider, SkinPortProvider } from '../../providers';
import { ItemRepository } from '../../repositories';
import { Currency } from '../../model';
import { skinPortItems, cachedItems, skinPortNonTradableItems } from '../__fixtures__/items';
import { skinPortConfig } from '../../config/skin-port.config';
import MockedBull from '../../jobs/__mocks__/bull';
import { ITEM_SYNC_QUEUE } from '../../jobs/sync-api-items.job';

let itemService: ItemService;
let redisProviderMocked: jest.Mocked<RedisProvider>;
let skinPortProviderMocked: jest.Mocked<SkinPortProvider>;
let mockedBullQueue: jest.Mocked<Bull.Queue>

beforeAll(() => {
  Container.reset();

  redisProviderMocked = createMockInstance(RedisProvider);
  Container.set(RedisProvider, redisProviderMocked);

  skinPortProviderMocked = createMockInstance(SkinPortProvider);
  Container.set(SkinPortProvider, skinPortProviderMocked);

  const loggerMocked = createMockInstance(LoggerService);
  Container.set(LoggerService, loggerMocked);

  const itemRepositoryMocked = createMockInstance(ItemRepository);
  Container.set(ItemRepository, itemRepositoryMocked);

  mockedBullQueue = createMockInstance(MockedBull);
  Container.set(ITEM_SYNC_QUEUE, mockedBullQueue)

  // Create an instance of ItemService with mocked dependencies
  itemService = Container.get(ItemService)
});

beforeEach(() => {
  jest.resetAllMocks();
});


describe('ItemService', () => {

  describe('getSkinPortItems', () => {
    it('should return cached items if available', async () => {
      const appId = 730;
      const currency = Currency.EUR;
      const cacheKey = `skin-port-items:${appId}:${currency}`;

      // Mock RedisProvider to return cached items
      redisProviderMocked.get.mockResolvedValue(JSON.stringify(cachedItems));

      const result = await itemService.getSkinPortItems(appId, currency);

      expect(redisProviderMocked.get).toHaveBeenCalledWith(cacheKey);
      expect(result).toEqual(cachedItems);
    });

    it('should fetch items from the API if not cached and cache them', async () => {
      const appId = 730;
      const currency = Currency.EUR;
      const cacheKey = `skin-port-items:${appId}:${currency}`;

      // Mock RedisProvider to return null (no cached data)
      redisProviderMocked.get.mockResolvedValue(null);

      // Mock SkinPortProvider to return items
      skinPortProviderMocked.fetchItems.mockResolvedValueOnce(skinPortItems);
      skinPortProviderMocked.fetchItems.mockResolvedValueOnce(skinPortNonTradableItems);

      const result = await itemService.getSkinPortItems(appId, currency);

      expect(redisProviderMocked.get).toHaveBeenCalledWith(cacheKey);
      expect(skinPortProviderMocked.fetchItems).toHaveBeenCalledTimes(2);
      expect(redisProviderMocked.set).toHaveBeenCalledWith(
        cacheKey,
        JSON.stringify(cachedItems),
        skinPortConfig.cacheTTL
      );
      expect(mockedBullQueue.add).toHaveBeenCalledWith({ cacheKey });
      expect(result).toEqual(cachedItems);
    });
  });

  describe('test method', () => {
    it('should return 200', () => {
      const result = itemService.test();
      expect(result).toBe(200);
    });
  });
});
