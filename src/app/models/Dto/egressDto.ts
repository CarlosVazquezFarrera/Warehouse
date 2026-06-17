import { BaseDto } from "./baseDto";

export interface EgressDto extends BaseDto {
  amountRemoved: number;
  date: string | null;
  productId: string;
  departmentId: string;
  quantityBefore?: number;
  quantityAfter?: number;
}
