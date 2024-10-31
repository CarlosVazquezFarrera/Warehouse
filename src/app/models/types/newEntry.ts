import { Entry } from "@models/DTO/entry";

export type NewEntry = Pick<Entry, 'productId' | 'quantityIncoming'>;
