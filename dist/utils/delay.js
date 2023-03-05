"use strict";
// credit: Praveen Kumar https://blog.praveen.science/right-way-of-delaying-execution-synchronously-in-javascript-without-using-loops-or-timeouts/
Object.defineProperty(exports, "__esModule", { value: true });
exports.delay = void 0;
const delay = (backoffCoefficient) => {
    try {
        return new Promise(resolved => {
            setTimeout(() => {
                resolved();
            }, 100 * backoffCoefficient * backoffCoefficient);
        });
    }
    catch (err) {
        throw err;
    }
};
exports.delay = delay;
