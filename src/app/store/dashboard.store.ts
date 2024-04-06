import { computed, inject } from "@angular/core";
import { Agent } from "@models/DTO/agent";
import { Airport } from "@models/DTO/airport"
import { InventoryItem } from "@models/api/inventoryItem";
import { patchState, signalStore, withComputed, withMethods, withState } from "@ngrx/signals";
import { AgentService } from "@services/agent.service";
import { AirportService } from "@services/airport.service";
import { InventoryService } from "@services/inventory.service";

type DashBoard = {
  airport: Airport[],
  agents: Agent[],
  inventory: InventoryItem[]
}

const initialState: DashBoard = {
  airport: [],
  inventory: [],
  agents: []
}


export const DasboardStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withMethods((store, airportService = inject(AirportService), inventoryService = inject(InventoryService), agentService = inject(AgentService)) => ({
    async getAiports(): Promise<void> {
      const airports = await airportService.getAll();
      patchState(store, { airport: airports })
    },
    async getInventoryByAirport(id: string): Promise<void> {
      const inventory = await inventoryService.getInventoryByAirport(id);
      patchState(store, { inventory })
    },
    async getAgents(): Promise<void> {
      const agents = await agentService.getAgents();
      patchState(store, { agents })
    }
  })),
  withComputed(({ inventory }) => ({
    inventoryCount: computed(() => inventory().length)
  }))

);
