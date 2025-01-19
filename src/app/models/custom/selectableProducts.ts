import { Product } from "@models/DTO/product";

export interface SelectableProducts extends Product {
    isSelected: boolean;
}