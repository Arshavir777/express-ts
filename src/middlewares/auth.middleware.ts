import { Action } from 'routing-controllers';
import Container from 'typedi';
import { UserRepository } from '../repositories';
import { Request } from 'express';

async function getAuthUserFromRequest(request: Request) {
    if (!request.session?.currentUserId) {
        return null;
    }
    const userRepository = Container.get(UserRepository);
    return userRepository.findById(request.session.currentUserId);
}

export const currentUserChecker = async ({ request }: Action) => {
    return getAuthUserFromRequest(request);
}

export const authorizationChecker = async ({ request }: Action) => {
    const user = await getAuthUserFromRequest(request);
    return Boolean(user);
}