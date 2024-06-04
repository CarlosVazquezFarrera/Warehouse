import { Supply } from "@models/DTO/supply";

export type NewSupply = Pick<Supply, 'currentQuantity' | 'productId' | 'airportId'>;