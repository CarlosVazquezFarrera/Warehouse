import { ProductDto } from "../Dto/productDto";

export type Product = Omit<ProductDto, 'id' | 'airportId' | 'packagingTypeName' | 'productFormatName' | 'presentationName' | 'categoryName'>;
