
import { Service } from "typedi";
import { Get, JsonController, QueryParams } from "routing-controllers";
import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsPositive } from "class-validator";
import { ItemService } from "../services/item.service";
import { Currency } from "../model/item.model";
import { FindItemsDTO } from "../dto";

class SkinPortItemsQueryParams {
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
@JsonController('/')
export class ItemsController {
    constructor(
        protected itemService: ItemService
    ) { }

    @Get('skin-port-items')
    public async getSkinPortItems(
        @QueryParams() { appId, currency }: SkinPortItemsQueryParams,
    ) {
        return this.itemService.getSkinPortItems(appId, currency);
    }

    @Get('items')
    // TODO: open if need auth
    // @Authorized()
    public async getItems(
        @QueryParams() params: FindItemsDTO,
    ) {
        return this.itemService.getItems(params);
    }
}
