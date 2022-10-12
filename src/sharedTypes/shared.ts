export interface AuthResponse {
    authenticated: boolean,
    message: string,
    token?: string | undefined
}

export interface ErrorReportInterface {
    message: string,
    name: string,
    stackTrace: string,
    browserVersion: string,
    timestamp: string|undefined
}
