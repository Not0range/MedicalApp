import moment from "moment";

export interface Time {
  hours: number;
  minutes: number;
}

export interface Times {
  times: Time[]
}

export interface EventTime {
  title: string,
  remained: number,
  remainedStr: string
}

export function getTodayTime(time: Time): moment.Moment {
  return moment().hours(time.hours)
        .minutes(time.minutes)
        .seconds(0)
}