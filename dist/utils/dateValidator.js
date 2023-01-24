"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dateValidator = void 0;
const luxon_1 = require("luxon");
const dateValidator = (newDate) => {
    return luxon_1.DateTime.fromISO(newDate).isValid ||
        luxon_1.DateTime.fromRFC2822(newDate).isValid ||
        luxon_1.DateTime.fromHTTP(newDate).isValid;
};
exports.dateValidator = dateValidator;
