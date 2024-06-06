import { Agent } from "@models/DTO/agent";

export type NewAgent = Pick<Agent, 'agentNumber' | 'shortName' | 'name' | 'lastName' | 'email' | 'password'>;
