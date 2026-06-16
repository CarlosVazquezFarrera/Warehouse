import { ProductDto } from "@models/Dto/productDto";

export interface SelectableProduct extends ProductDto {
    isSelected: boolean;
}
