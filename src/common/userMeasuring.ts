import MinDate from "./minDate";

export default interface UserMeasuring {
  id: number;
  type: string,
  dateTime: MinDate,
  value: number
}