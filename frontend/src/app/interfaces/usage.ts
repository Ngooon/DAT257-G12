import { Garment } from "./garment";

export interface Usage {
    id: number;
    time: string;
    garment: Garment
    notes: string;
}