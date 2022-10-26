"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorLogger = void 0;
const env_1 = require("../../utils/env");
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
    return {
        init: async (appId, appSecret, timestampOpts) => {
            try {
                timestampOptions = timestampOpts;
                if (env_1.AUTH_URI) {
                    const data = await fetch(env_1.AUTH_URI, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            appId,
                            appSecret
                        })
                    });
                    const parsedData = await data.json();
                    if (data.ok) {
                        sessionStorage.setItem('error-log-token', parsedData.token);
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
        },
        send: async (error) => {
            try {
                const browser = getBrowser();
                const ts = timestamp(timestampOptions);
                const errorRep = new ErrorReport(error.message, error.name, error.stack, browser, ts);
                if (env_1.LOGS_URI) {
                    const data = await fetch(env_1.LOGS_URI, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': 'Bearer ' + sessionStorage.getItem('error-log-token'),
                        },
                        body: JSON.stringify(errorRep)
                    });
                    const parsedData = await data.json();
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
        }
    };
})();
