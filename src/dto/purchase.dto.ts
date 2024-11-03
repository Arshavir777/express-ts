import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsPositive } from "class-validator";

export class PurchaseDTO {
    @IsNotEmpty()
    @IsNumber()
    itemId!: number;

    @IsOptional()
    @IsNumber()
    @IsPositive()
    quantity: number = 1;

    @IsOptional()
    @IsBoolean()
    isTradable: boolean = true
}
