import { Currency } from "../model/item.model";

export const skinPortConfig = {
    baseURL: 'https://api.skinport.com/v1',
    defaultAppId: 730,
    defaultCurrency: Currency.EUR,
    cacheTTL: 3600 // ms
}
