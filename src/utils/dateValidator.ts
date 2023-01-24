import { DateTime } from 'luxon';

export const dateValidator = (newDate: string) => {
    return  DateTime.fromISO(newDate).isValid ||
            DateTime.fromRFC2822(newDate).isValid ||
            DateTime.fromHTTP(newDate).isValid;
}