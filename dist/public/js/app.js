"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorLogger = void 0;
exports.ErrorLogger = (() => {
    class ErrorReport {
        constructor(message, name, stackTrace, browserVersion, timestamp) {
            this.message = message;
            this.name = name;
            this.stackTrace = stackTrace;
            this.browserVersion = browserVersion;
            this.timestamp = timestamp;
        }
    }
    const authURL = 'http://localhost:3000/auth';
    const logURL = 'http://localhost:3000/logs';
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
    return {
        init: (appId, appSecret) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                const data = yield fetch(authURL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        appId,
                        appSecret
                    })
                });
                const parsedData = yield data.json();
                if (parsedData.authenticated !== false) {
                    sessionStorage.setItem('error-log-token', parsedData.token);
                }
                else {
                    throw new Error(parsedData.message);
                }
            }
            catch (error) {
                console.log(error);
                window.alert('ErrorLogger authentication failed: check console or contact administrator.');
            }
        }),
        send: (error, timestampOptions = { locale: 'fr-BE', timeZone: 'Europe/Brussels' }) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                const browser = getBrowser();
                const ts = timestamp(timestampOptions);
                const errorRep = new ErrorReport(error.message, error.name, error.stack, browser, ts);
                const data = yield fetch(logURL, {
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
            catch (error) {
                throw new Error('Error logging error in error DB');
            }
        })
    };
})();
