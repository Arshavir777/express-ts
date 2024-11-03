import { IsNotEmpty, IsNumber, IsOptional, IsPositive, Min } from "class-validator";

export class FindItemsDTO {
    @IsNumber()
    @IsPositive()
    @IsNotEmpty()
    public appId!: number

    @IsOptional()
    @IsNumber()
    @Min(1)
    public page: number = 1;

    @IsOptional()
    @IsNumber()
    @Min(1)
    public limit: number = 10;

    @IsOptional()
    public search?: string
}
