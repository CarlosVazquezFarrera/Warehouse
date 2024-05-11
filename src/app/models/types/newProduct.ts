import { Product } from "@models/DTO/product";

export type NewProduct = Pick<Product, 'name' | 'supplierPart'>;
