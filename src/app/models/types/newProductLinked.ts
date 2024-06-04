import { Supply } from "@models/DTO/supply";

export type NewProductLinked   = Pick<Supply, 'currentQuantity' | 'productId' >;