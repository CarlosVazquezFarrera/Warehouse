import { EgressDto } from "../Dto/egressDto";

export type Egress = Omit<EgressDto, 'id' | 'date'>;
