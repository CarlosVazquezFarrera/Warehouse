import { ProductDto } from "../Dto/productDto";

export interface SelectableProduct extends ProductDto {
    isSelected: boolean;
}
