import { Query, Send } from 'express-serve-static-core';
import * as express from 'express';

// shared between API and static module

export interface TypedRequest<T, U extends Query> extends express.Request{
    body: T,
    query: U
}

export interface TypedResponse<ResBody> extends express.Response{
    json: Send<ResBody, this>;
}

export interface AuthResponse {
    message: string,
    token: string | undefined
}

export interface AuthRequest {
    appId: string,
    appSecret: string
};

export interface ErrorReportInterface {
    message: string,
    name: string,
    stack: string,
    actions: object[],
    browserVersion: string,
    timestamp: number
};

export interface RequestBodyInterface extends ErrorReportInterface {
    appId: string,
    sessionId: string
}

export type ErrorResponseType = Error & {statusCode: number};

export interface TimestampOptions {
    format?: string,
    timezone?: string
}

// shared between API and front end

export type ViewType = 'atomic' | 'error' | 'session';

export interface AdminAuthRequest {
    name: string,
    password: string,
    userId?: string
};

export interface QueryInterface {
    startDate: string, 
    endDate: string, 
    sessionId: string, 
    name: string, 
    page: string, 
    limit: string, 
    view: string
}