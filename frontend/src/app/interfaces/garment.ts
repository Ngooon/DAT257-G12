import { Category } from "./category";

export interface Garment {
    id: number;
    wardrobe: string;
    name: string;
    color: string;
    size: string;
    brand: string;
    category: Category;
    usage_count: number;
}