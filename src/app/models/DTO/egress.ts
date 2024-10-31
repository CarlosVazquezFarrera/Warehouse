import { BaseDTO } from "./baseDTO";

export interface Egress extends BaseDTO {
  amountRemoved: number;
  quantityBefore: number;
  quantityAfter: number;
  date: string | null;
  petitionerId: string;
  approverId: string;
  productId: string;
}
