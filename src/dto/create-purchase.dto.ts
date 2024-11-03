export class CreatePurchaseDTO {
  public itemId: number;
  public userId: number;
  public quantity: number;
  public totalPrice: number;
  public isTradable: boolean;

  constructor(itemId: number, userId: number, quantity: number, totalPrice: number, isTradable: boolean) {
    this.itemId = itemId;
    this.userId = userId;
    this.quantity = quantity;
    this.totalPrice = totalPrice;
    this.isTradable = isTradable;
  }
}
