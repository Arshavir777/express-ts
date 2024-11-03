export enum Currency {
    AUD = 'AUD',
    BRL = 'BRL',
    CAD = 'CAD',
    CHF = 'CHF',
    CNY = 'CNY',
    CZK = 'CZK',
    DKK = 'DKK',
    EUR = 'EUR',
    GBP = 'GBP',
    HRK = 'HRK',
    NOK = 'NOK',
    PLN = 'PLN',
    RUB = 'RUB',
    SEK = 'SEK',
    TRY = 'TRY',
    USD = 'USD'
}

export interface Item {
    id: number;
    name: string;
    app_id: number,
    currency: Currency;
    item_page: string,
    tradable_price: number,
    non_tradable_price: number,
    quantity: number;
    created_at: Date;
}
