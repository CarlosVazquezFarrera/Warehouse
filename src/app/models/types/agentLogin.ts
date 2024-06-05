import { Agent } from "@models/DTO/agent";

export type AgentLogin = Pick<Agent, 'agentNumber' | 'shortName' | 'name' | 'lastName' | 'email'>;
