import { BaseDTO } from "./baseDTO";

export interface Product extends BaseDTO {
  name: string;
  supplierPart: string;
  packagingTypeId: string;
  presentationId: string;
  presentationQuantity: number;
  productFormatId: string;
  formatQuantity: number;
  stock: number;
  airportId: string;
  packagingTypeName: string;
  productFormatName: string;
  presentationName: string;
}
