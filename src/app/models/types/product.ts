import { ProductDto } from "@models/Dto/productDto";

export type Product = Omit<ProductDto, 'id' | 'airportId' | 'packagingTypeName' | 'productFormatName' | 'presentationName' | 'categoryName'>;
