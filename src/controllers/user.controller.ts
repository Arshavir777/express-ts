
import { NextFunction, Request, Response } from "express"
import { Service } from "typedi";
import { UserService } from "../services";
import { Controller } from "../decorators/controller.decorator";
import { Get } from "../decorators/router.decorator";

@Controller('/users')
@Service()
export default class TestController {

    constructor(private userService: UserService) { }

    @Get('/:id')
    public getHello = async (request: Request, response: Response, next: NextFunction) => {
        const userId = + request.params.id;        
        const user = await this.userService.getUserById(userId);
        return response.json(user);
    }

}
