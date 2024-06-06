import { Agent } from "@models/DTO/agent";

export type AgentBaseInfo = Pick<Agent, 'agentNumber' | 'shortName' | 'name' | 'lastName' | 'email' | 'id'>;
