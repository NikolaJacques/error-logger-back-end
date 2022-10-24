export interface AuthResponse {
    message: string,
    token?: string | undefined
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
    timestamp: string|undefined
};

export type ErrorResponseType = Error & {statusCode: number};