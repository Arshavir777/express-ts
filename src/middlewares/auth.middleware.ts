import { Action } from 'routing-controllers';
import Container from 'typedi';
import { UserRepository } from '../repositories';

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