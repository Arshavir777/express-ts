import { RequestHandler } from "express";

export enum HttpMethods {
    OPTIONS = 'options',
    GET = 'get',
    HEAD = 'head',
    POST = 'post',
    PUT = 'put',
    PATCH = 'patch',
    DELETE = 'delete',
    TRACE = 'trace',
}

export interface RouteDefinition {
    path: string;
    method: HttpMethods,
    methodName: string,
    middlewares: RequestHandler[]
}
