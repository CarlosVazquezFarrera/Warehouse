export interface Egress {
  id: string;
  amountRemoved: number;
  quantityBefore: number;
  quantityAfter: number;
  date: string | null;
  petitionerId: string;
  approverId: string;
  supplyId: string;
}
