import moment from 'moment';
import { Time } from './time'

export default interface MinDate {
    day: number;
    month: number;
    year: number;
    time: Time
}

export function getMoment(date: MinDate) {
    return moment().date(date.day).month(date.month - 1).year(date.year)
    .hour(date.time.hours).minute(date.time.minutes)
    .second(0).millisecond(0);
}