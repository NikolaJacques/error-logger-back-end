var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
export const ErrorLogger = (() => {
    class ErrorReport {
        constructor(message, name, stackTrace, browserVersion, timestamp) {
            this.message = message;
            this.name = name;
            this.stackTrace = stackTrace;
            this.browserVersion = browserVersion;
            this.timestamp = timestamp;
        }
    }
    // user agent sniffing (from https://www.seanmcp.com/articles/how-to-get-the-browser-version-in-javascript/)
    const getBrowser = () => {
        try {
            const { userAgent } = navigator;
            if (userAgent.includes('Firefox/')) {
                return `Firefox v${userAgent.split('Firefox/')[1]}`;
            }
            else if (userAgent.includes('Edg/')) {
                return `Edge v${userAgent.split('Edg/')[1]}`;
            }
            else if (userAgent.includes('Chrome/')) {
                return `Chrome v${userAgent.split('Chrome/')[1].split(' ')[0]}`;
            }
            else if (userAgent.includes('Safari/')) {
                return `Safari v${userAgent.split('Safari/')[1]}`;
            }
            else {
                return 'unknown';
            }
        }
        catch (error) {
            throw new Error('Couldn\'t retrieve browser');
        }
    };
    // timestamp function
    const timestamp = (options) => {
        const { locale, timeZone } = options;
        try {
            const dateStr = (new Date).toLocaleString(locale, { timeZone });
            return dateStr;
        }
        catch (error) {
            throw new Error('Couldn\'t retrieve date');
        }
    };
    let timestampOptions = { locale: 'fr-BE', timeZone: 'Europe/Brussels' };
    const url = 'http://localhost:3000/logs/';
    return {
        init: (appId, appSecret) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                const AUTH_URI = url + 'auth';
                if (AUTH_URI) {
                    const data = yield fetch(AUTH_URI, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            appId,
                            appSecret
                        })
                    });
                    const parsedData = yield data.json();
                    if (data.ok) {
                        sessionStorage.setItem('error-log-token', parsedData.token);
                        timestampOptions = parsedData.timestampOtions ? parsedData.timestampOtions : timestampOptions;
                    }
                    else {
                        throw new Error(parsedData.message);
                    }
                }
                else {
                    throw new Error('Auth URL not defined');
                }
            }
            catch (error) {
                console.log(error);
                window.alert('ErrorLogger authentication failed: check console or contact administrator.');
            }
        }),
        send: (error) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                const LOGS_URI = url;
                const browser = getBrowser();
                const ts = timestamp(timestampOptions);
                const errorRep = new ErrorReport(error.message, error.name, error.stack, browser, ts);
                if (LOGS_URI) {
                    const data = yield fetch(LOGS_URI, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': 'Bearer ' + sessionStorage.getItem('error-log-token'),
                        },
                        body: JSON.stringify(errorRep)
                    });
                    const parsedData = yield data.json();
                    console.log(parsedData.message);
                }
                else {
                    throw new Error('Logs URL not defined');
                }
            }
            catch (error) {
                console.log(error);
                window.alert('Error logging error in error DB');
            }
        })
    };
})();
