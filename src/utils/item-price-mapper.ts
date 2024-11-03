import { CreateItemDTO } from "../dto";
import { SkinPortItem } from "../model";

/**
 * Merge tradable and non-tradable prices
 * @param {SkinPortItem[]} tradableItems tradable skin-port items
 * @param {number} appId app_id from skin port
 * @returns {CreateItemDTO[]}
 */
export function mapTradableAndNonTradablePrices(tradableItems: SkinPortItem[], nonTradableItems: SkinPortItem[], appId: number): CreateItemDTO[] {
    const nonTradableIndex = new Map<string, any>();
    nonTradableItems.forEach(item => {
        nonTradableIndex.set(item.market_hash_name, item);
    });

    return tradableItems.map(item => {
        const nonTradableItem = nonTradableIndex.get(item.market_hash_name);
        return {
            name: item.market_hash_name,
            app_id: appId,
            item_page: item.item_page,
            currency: item.currency,
            quantity: item.quantity,
            tradable_price: item.min_price,
            non_tradable_price: nonTradableItem.min_price || 0
        }
    });
}
