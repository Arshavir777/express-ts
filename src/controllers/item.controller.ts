
import { Service } from "typedi";
import { Get, JsonController, QueryParams } from "routing-controllers";
import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsPositive } from "class-validator";
import { ItemService } from "../services/item.service";
import { Currency } from "../model/item.model";

class ItemsQueryParams {
    @IsNotEmpty()
    @IsNumber()
    @IsPositive()
    public appId!: number

    @IsOptional()
    @IsEnum(Currency)
    @Reflect.metadata('design:type', { name: 'string' })
    public currency?: Currency
}

@Service()
@JsonController('/items')
export class ItemController {
    constructor(
        protected itemService: ItemService
    ) { }

    @Get()
    public async getItems(
        @QueryParams() { appId, currency }: ItemsQueryParams,
    ) {
        return this.itemService.getSkinPortItems(appId, currency);
    }
}
