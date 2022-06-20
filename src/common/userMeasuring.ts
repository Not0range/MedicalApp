import MinDate from "./minDate";

export default interface UserMeasuring {
  id: number;
  type: string,
  date: MinDate,
  value: number[]
}