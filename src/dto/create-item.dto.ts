import { Currency } from "../model";

export class CreateItemDTO {
  public name: string;
  public app_id: number;
  public currency: Currency;
  public item_page: string;
  public tradable_price: number;
  public non_tradable_price: number;
  public quantity: number;

  constructor(
    name: string,
    app_id: number,
    currency: Currency,
    item_page: string,
    tradable_price: number,
    non_tradable_price: number,
    quantity: number
  ) {
    this.name = name;
    this.app_id = app_id;
    this.currency = currency;
    this.item_page = item_page;
    this.tradable_price = tradable_price;
    this.non_tradable_price = non_tradable_price;
    this.quantity = quantity;
  }
}
