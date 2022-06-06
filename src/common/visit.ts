import Contact from "./contact";
import MinDate from "./minDate";

export default interface Visit {
    id: number;
    doctor: Contact | undefined;
    date: MinDate;
}