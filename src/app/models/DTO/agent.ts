import { BaseDTO } from "./baseDTO"

export interface Agent extends BaseDTO {
  agentNumber: string
  shortName: string
  name: string
  lastName: string
  email: string
  password: string
  airportId: string;
  isActive?: boolean
}
