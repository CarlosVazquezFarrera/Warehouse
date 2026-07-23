import { BaseDto } from "@models/Dto/baseDto";

export interface TotalEgressMovementDto extends BaseDto {
  name: string;
  supplierPart : string;
  unitsRemoved: number;
  totalMovements: number;
}
