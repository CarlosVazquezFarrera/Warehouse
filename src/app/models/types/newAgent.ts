import { Agent } from "@models/DTO/agent";

export type NewAgent = Omit<Agent, 'id'>;
