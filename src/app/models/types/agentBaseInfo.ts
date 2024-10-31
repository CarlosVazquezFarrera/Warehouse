import { Agent } from "@models/DTO/agent";

export type AgentBaseInfo = Omit<Agent, | 'password' | 'isActive'>;
