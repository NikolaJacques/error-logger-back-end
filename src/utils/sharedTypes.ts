// shared between API and static module

export interface AuthResponse {
    message: string,
    token?: string | undefined,
    timestampOtions?: TimestampOptions | undefined
}

export interface AuthRequest {
    appId: string,
    appSecret: string
};

export interface ErrorReportInterface {
    message: string,
    name: string,
    stackTrace: string,
    browserVersion: string,
    timestamp: string
};

export type ErrorResponseType = Error & {statusCode: number};

export interface TimestampOptions {
    locale: string,
    timeZone: string
}

// shared between API and front end

export type ViewType = 'atomic' | 'error' | 'session';

export interface AdminAuthRequest {
    name: string,
    password: string
};