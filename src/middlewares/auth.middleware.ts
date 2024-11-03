import { Action, ExpressMiddlewareInterface } from 'routing-controllers';
import { Request, Response, NextFunction } from 'express';
import Container, { Service } from 'typedi';
import { UserRepository } from '../repositories';

@Service()
export class AuthMiddleware implements ExpressMiddlewareInterface {
    use(req: Request, res: Response, next: NextFunction): void {
        if (req.session && req.session.currentUserId) {            
            next();
        } else {
            res.status(401).json({ message: 'Unauthorized' });
        }
    }
}

export const currentUserChecker = async ({ request }: Action) => {
    if (request.session && request.session.currentUserId) {
        const userRepository = Container.get(UserRepository);
        const user = await userRepository.findById(request.session.currentUserId);
        return user
    }

    return null;
}

export const authorizationChecker = async ({ request }: Action) => {
    if (request.session && request.session.currentUserId) {
        const userRepository = Container.get(UserRepository);
        const user = await userRepository.findById(request.session.currentUserId);
        return Boolean(user);
    }

    return false;
}