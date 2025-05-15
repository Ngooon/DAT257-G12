import { Garment } from "./garment";
import { PaymentMethod } from "./payment_method";
import { User } from "./user";

export interface Listing {
    id: number;
    garment: Garment;
    description: string;
    time: string;
    place: string;
    price: number;
    payment_method: PaymentMethod;
}