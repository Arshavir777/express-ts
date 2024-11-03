import Container from 'typedi';
import { ItemService } from '../../src/services';

describe('YourService', () => {
  it('should return correct data', () => {
    const itemService = Container.get(ItemService);
    const result = itemService.test()
    expect(result).toBe(200);
  });
});
