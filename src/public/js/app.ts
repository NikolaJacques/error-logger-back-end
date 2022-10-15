import {ErrorReportInterface, AuthResponse, AuthRequest} from '../../utils/sharedTypes';
import * as dotenv from 'dotenv';
dotenv.config();

export const ErrorLogger = (() => {

    class ErrorReport implements ErrorReportInterface {
        constructor(
            public message: string,
            public name: string,
            public stackTrace: string,
            public browserVersion: string,
            public timestamp: string|undefined
        ){}
    }

    interface TimestampOptions {
        locale: string,
        timeZone: string
    }

    const authURL:string|undefined = process.env.AUTH_URI;
    const logsURL:string|undefined = process.env.LOGS_URI;

    // user agent sniffing (from https://www.seanmcp.com/articles/how-to-get-the-browser-version-in-javascript/)
    const getBrowser = () => {
        try {        
            const { userAgent } = navigator;
            if (userAgent.includes('Firefox/')) {
                return `Firefox v${userAgent.split('Firefox/')[1]}`;
            } else if (userAgent.includes('Edg/')) {
            return `Edge v${userAgent.split('Edg/')[1]}`
            } else if (userAgent.includes('Chrome/')) {
                return `Chrome v${userAgent.split('Chrome/')[1].split(' ')[0]}`
            } else if (userAgent.includes('Safari/')) {
                return `Safari v${userAgent.split('Safari/')[1]}`
            } else {
                return 'unknown';
            }
        }
        catch(error){
            throw new Error('Couldn\'t retrieve browser');
        }
  }
  
  // timestamp function
  const timestamp = (options: TimestampOptions) => {
    const { locale, timeZone } = options;
    try {
      const dateStr = (new Date).toLocaleString(locale, {timeZone});
      return dateStr;
    }
    catch(error){
      throw new Error('Couldn\'t retrieve date');
    }
  }

  let timestampOptions: TimestampOptions = {locale: 'fr-BE', timeZone: 'Europe/Brussels'};

    return {
        init: async (appId:string, appSecret: string, timestampOpts: TimestampOptions):Promise<void> => {
            try {
                timestampOptions = timestampOpts;
                if (authURL){
                    const data = await fetch(authURL, {
                        method: 'POST',
                        headers: {'Content-Type': 'application/json'},
                        body: JSON.stringify({
                            appId,
                            appSecret
                        } as AuthRequest)
                    })
                    const parsedData: AuthResponse = await data.json();
                    if (parsedData.authenticated!==false){
                        sessionStorage.setItem('error-log-token', parsedData.token!);
                    } else {
                        throw new Error(parsedData.message);
                    }
                } else {
                    throw new Error('Auth URL not defined');
                }
            }
            catch(error){
                console.log(error);
                window.alert('ErrorLogger authentication failed: check console or contact administrator.');
            }
        },
        send: async (error: Error):Promise<void> => {
            try {
                const browser = getBrowser();
                const ts:string = timestamp(timestampOptions);
                const errorRep = new ErrorReport(error.message, error.name, error.stack!, browser!, ts);
                if(logsURL){
                    const data = await fetch(logsURL, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': 'Bearer ' + sessionStorage.getItem('error-log-token'),
                        },
                        body: JSON.stringify(errorRep)
                    })
                    const parsedData = await data.json();
                    console.log(parsedData.message);
                } else {
                    throw new Error('Logs URL not defined');
                }
            }
            catch(error){
                throw new Error('Error logging error in error DB');
            }
        }
    }
})();