import { Service } from 'typedi';
import { PurchaseService } from '../services';
import { OpenAPI } from 'routing-controllers-openapi';
import { Authorized, Body, CurrentUser, HttpCode, JsonController, Post } from 'routing-controllers';
import { PurchaseDTO } from '../dto';
import { User } from '../model';

@Service()
@JsonController('/purchase')
export class PurchaseController {
    constructor(private purchaseService: PurchaseService) { }

    @OpenAPI({
        description: 'Purchase request',
        security: [{ cookieAuth: [] }],
        responses: {
            '201': {
                description: 'Successfully purchase, return current balance',
            },
            '400': {
                description: 'Bad request',
            },
            '422': {
                description: 'Insufficient balance or item quantity'
            }
        },
    })
    @Post('/')
    @Authorized()
    @HttpCode(201)
    async createPurchase(
        @Body() purchaseData: PurchaseDTO,
        @CurrentUser() currentUser: User
    ) {
        const currentBalance = await this.purchaseService.createPurchase(currentUser, purchaseData);
        return { currentBalance };
    }
}
