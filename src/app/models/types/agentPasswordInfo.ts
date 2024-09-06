import { Agent } from "@models/DTO/agent";

export type AgentPasswordInfo = Pick<Agent, 'id' | 'password'>;
