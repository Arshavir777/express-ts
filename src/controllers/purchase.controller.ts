import { Service } from 'typedi';
import { PurchaseService } from '../services';
import { Authorized, Body, CurrentUser, HttpCode, JsonController, Post } from 'routing-controllers';
import { PurchaseDTO } from '../dto';
import { User } from '../model';
import { OpenAPI, ResponseSchema } from 'routing-controllers-openapi';

@Service()
@JsonController('/purchase')
export class PurchaseController {
    constructor(private purchaseService: PurchaseService) { }

    @OpenAPI({
        description: 'Purchase request',
        security: [{ cookieAuth: [] }],
        responses: {
            '201': {
                description: 'Successfully purchase',
            },
            '400': {
                description: 'Bad request',
            },
            '422': {
                description: 'Insufficient balance'
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
        return this.purchaseService.createPurchase(currentUser, purchaseData);
    }
}
