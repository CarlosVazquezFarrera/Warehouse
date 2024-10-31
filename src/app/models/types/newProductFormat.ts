import { ProductFormat } from "@models/DTO/productFormat";

export type NewProductFormat = Omit<ProductFormat, 'id'>;