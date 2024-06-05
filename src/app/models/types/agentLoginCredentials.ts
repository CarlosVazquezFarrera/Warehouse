import { Agent } from "@models/DTO/agent";

export type AgentLoginCredentials = Pick<Agent, 'agentNumber' | 'password'>;
