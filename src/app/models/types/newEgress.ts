import { Egress } from "@models/DTO/egress";

export type NewEgress = Pick<Egress, 'amountRemoved' | 'petitionerId' | 'productId'>;
