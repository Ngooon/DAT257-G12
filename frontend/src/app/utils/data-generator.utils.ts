import { Garment } from "../interfaces/garment";

export function generateFriendlyId(garment: Garment): string {
    const colorPart = garment.color ? ` (${garment.color}` : '';
    const sizePart = garment.size ? `, ${garment.size})` : colorPart ? ')' : '';
    return `#${garment.id} ${garment.name}${colorPart}${sizePart}`;
}