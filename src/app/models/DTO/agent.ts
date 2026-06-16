import { BaseDto } from "./baseDto"

export interface AgentDto extends BaseDto {
  agentNumber: string
  shortName: string
  name: string
  lastName: string
  email: string
  airportId: string;
  isActive: boolean
  token: string
}
