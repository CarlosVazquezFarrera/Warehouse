export interface InventoryItem {
  id: string;
  name: string;
  airport: string;
  supplierPart?: string;
  currentQuantity: number;
}
