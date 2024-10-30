import { RequestHandler } from 'express';
import { HttpMethods, RouteDefinition } from '../model';

const getMethodFunction = (method: HttpMethods, path: string, middlewares: RequestHandler[]) => {
    return (target: any, propertyKey: string): void => {
        if (!Reflect.hasMetadata('routes', target.constructor)) {
            Reflect.defineMetadata('routes', [], target.constructor);
        }
        const routes = Reflect.getMetadata('routes', target.constructor) as Array<RouteDefinition>;
        routes.push({
            method,
            middlewares,
            path,
            methodName: propertyKey
        });
        Reflect.defineMetadata('routes', routes, target.constructor);
    };
};

export const Options = (path: string, middlewares: RequestHandler[] = []) => getMethodFunction(HttpMethods.OPTIONS, path, middlewares);
export const Get = (path: string, middlewares: RequestHandler[] = []) => getMethodFunction(HttpMethods.GET, path, middlewares);
export const Head = (path: string, middlewares: RequestHandler[] = []) => getMethodFunction(HttpMethods.HEAD, path, middlewares);
export const Post = (path: string, middlewares: RequestHandler[] = []) => getMethodFunction(HttpMethods.POST, path, middlewares);
export const Put = (path: string, middlewares: RequestHandler[] = []) => getMethodFunction(HttpMethods.PUT, path, middlewares);
export const Patch = (path: string, middlewares: RequestHandler[] = []) => getMethodFunction(HttpMethods.PATCH, path, middlewares);
export const Delete = (path: string, middlewares: RequestHandler[] = []) => getMethodFunction(HttpMethods.DELETE, path, middlewares);
export const Trace = (path: string, middlewares: RequestHandler[] = []) => getMethodFunction(HttpMethods.TRACE, path, middlewares);
