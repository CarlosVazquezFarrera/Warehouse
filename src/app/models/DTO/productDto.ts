import { BaseDto } from "./baseDto";

export interface ProductDto extends BaseDto {
  name: string;
  supplierPart: string;
  packagingTypeId: string;
  presentationId: string;
  presentationQuantity: number;
  productFormatId: string;
  formatQuantity: number;
  stock: number;
  airportId: string;
  packagingTypeName?: string;
  productFormatName?: string;
  presentationName?: string;
  categoryId: string;
  categoryName?: string;
}
