import { PaymentMethod } from "./payment_method";

interface Listing {
    id: number;
    garment: number;
    description: string;
    time: string;
    place: string;
    price: number;
    payment_method: PaymentMethod
}