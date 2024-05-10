import { Entry } from "@models/DTO/entry";

export type NewEntry = Pick<Entry, 'quantityIncoming' | 'supplyId'>;
