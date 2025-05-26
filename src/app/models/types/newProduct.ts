import { Product } from "@models/DTO/product";

export type NewProduct = Omit<Product, 'id' | 'airportId' | 'packagingTypeName' | 'productFormatName' | 'presentationName' | 'categoryName'>;
