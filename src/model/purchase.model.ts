export interface Purchase {
    id: number;
    item_id: number;
    user_id: number;
    total_price: number,
    is_tradable: boolean,
    quantity: number;
    purchased_at: Date;
}
