import {ErrorReportInterface, AuthResponse, AuthRequest, TimestampOptions} from '../../utils/sharedTypes';

export const ErrorLogger = (() => {

    class ErrorReport implements ErrorReportInterface {
        constructor(
            public message: string,
            public name: string,
            public stackTrace: string,
            public browserVersion: string,
            public timestamp: number
        ){}
    }

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
  const timestamp = ():number => {
    try {
      const dateStr = (new Date).getTime();
      return dateStr;
    }
    catch(error){
      throw new Error('Couldn\'t retrieve date');
    }
  }

  const url = 'http://localhost:3000/logs/';

    return {
        init: async (appId:string, appSecret: string):Promise<void> => {
            try {
                const AUTH_URI= url + 'auth/app';
                if (AUTH_URI){
                    const data = await fetch(AUTH_URI, {
                        method: 'POST',
                        headers: {'Content-Type': 'application/json'},
                        body: JSON.stringify({
                            appId,
                            appSecret
                        } as AuthRequest)
                    })
                    const parsedData: AuthResponse = await data.json();
                    if (data.ok){
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
                const LOGS_URI = url;
                const browser = getBrowser();
                const ts = timestamp();
                const errorRep = new ErrorReport(error.message, error.name, error.stack!, browser!, ts);
                if(LOGS_URI){
                    const data = await fetch(LOGS_URI, {
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
                console.log(error);
                window.alert('Error logging error in error DB');
            }
        }
    }
})();