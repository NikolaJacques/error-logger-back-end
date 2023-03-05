// credit: Praveen Kumar https://blog.praveen.science/right-way-of-delaying-execution-synchronously-in-javascript-without-using-loops-or-timeouts/

export const delay = (backoffCoefficient:number) => { 
    try {
      return new Promise<void>(resolved => {
        setTimeout(() => {
          resolved();
        }, 100 * backoffCoefficient * backoffCoefficient);
      });
    } catch(err:any){
      throw err;
    }
}