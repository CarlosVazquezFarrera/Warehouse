import { EgressDto } from "@models/Dto/egressDto";

export type Egress = Omit<EgressDto, 'id' | 'date'>;
