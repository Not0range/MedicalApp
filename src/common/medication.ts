import { Times } from "./time";

export default interface Medication extends Times {
    id: number;
    title: string;
}