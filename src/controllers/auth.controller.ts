import { Request } from "express";
import { Service } from "typedi";
import { Authorized, Body, CurrentUser, JsonController, Post, Req } from "routing-controllers";
import { OpenAPI } from "routing-controllers-openapi";
import { RegisterDTO, LoginDTO, ChangePasswordDTO } from "../dto";
import { AuthService, LoggerService } from "../services";
import { User } from "../model";

@Service()
@JsonController('/auth')
export class AuthController {

    constructor(
        protected authService: AuthService,
        protected logger: LoggerService
    ) { }

    @Post('/login')
    public async login(
        @Body({ validate: true, required: true }) data: LoginDTO,
        @Req() req: Request
    ) {
        const user = await this.authService.login(data);
        req.session.currentUserId = user.id;
        return user;
    }

    @Post('/register')
    public async register(
        @Body({ validate: true, required: true }) data: RegisterDTO,
        @Req() req: Request
    ) {
        const user = await this.authService.register(data);
        req.session.currentUserId = user.id;
        return user;
    }

    @Authorized()
    @OpenAPI({ security: [{ cookieAuth: [] }] })
    @Post('/change-password')
    public async changePassword(
        @Body({ validate: true, required: true }) data: ChangePasswordDTO,
        @CurrentUser() currentUser: User
    ) {
        await this.authService.changePassword(currentUser.id, data);
        return 'Password successfully changed';
    }

    @Authorized()
    @OpenAPI({ security: [{ cookieAuth: [] }] })
    @Post('/logout')
    public async logout(
        @Req() { session }: Request
    ) {
        session.destroy((err) => {
            this.logger.logError(err.message)
        })
        return 'Successfully logged out';
    }
}
