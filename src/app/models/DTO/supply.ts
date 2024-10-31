import { BaseDTO } from "./baseDTO";

export interface Supply extends BaseDTO {
    currentQuantity: number;
    productId: string;
    airportId: string;
}