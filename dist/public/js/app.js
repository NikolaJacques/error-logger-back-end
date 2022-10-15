"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorLogger = void 0;
const dotenv = __importStar(require("dotenv"));
dotenv.config();
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
    const authURL = process.env.AUTH_URI;
    const logsURL = process.env.LOGS_URI;
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
                if (authURL) {
                    const data = await fetch(authURL, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            appId,
                            appSecret
                        })
                    });
                    const parsedData = await data.json();
                    if (parsedData.authenticated !== false) {
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
                if (logsURL) {
                    const data = await fetch(logsURL, {
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
                throw new Error('Error logging error in error DB');
            }
        }
    };
})();
