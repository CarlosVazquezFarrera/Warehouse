import { computed, inject } from "@angular/core";
import { Agent } from "@models/DTO/agent";
import { Airport } from "@models/DTO/airport"
import { InventoryItem } from "@models/api/inventoryItem";
import { Egress } from "@models/custom/egress";
import { patchState, signalStore, withComputed, withMethods, withState } from "@ngrx/signals";
import { AgentService } from "@services/agent.service";
import { AirportService } from "@services/airport.service";
import { InventoryService } from "@services/inventory.service";

type DashBoard = {
  airport: Airport[],
  agents: Agent[],
  inventory: InventoryItem[],
  newEgress: Egress
}

const initialState: DashBoard = {
  airport: [],
  inventory: [],
  agents: [],
  newEgress: {
    amountRemoved: 0,
    petitionerId: "",
    supplyId: "",
  }
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
    },
    setPetitionerId(petitionerId: string): void {
      const newEgress: Egress = { ...store.newEgress(), petitionerId }
      patchState(store, { newEgress })
    },
    setRemovedAmount(amountRemoved: number): void {
      const newEgress: Egress = { ...store.newEgress(), amountRemoved }
      patchState(store, { newEgress })
    },
    setSupplyId(supplyId: string): void {
      const newEgress: Egress = { ...store.newEgress(), supplyId }
      patchState(store, { newEgress })
    }
  })),
  withComputed(({ inventory, newEgress, agents }) => ({
    inventoryCount: computed(() => inventory().length),
    supplySelected: computed(() => {
      const id = newEgress.supplyId();
      return inventory().find(i => i.id == id);
    }),
    petitionerSelected: computed(() => {
      const id = newEgress.petitionerId();
      const agent = agents().find(a => a.id == id);
      return `${agent?.agentNumber} - ${agent?.name} ${agent?.lastName}`;
    }),
    newAgressValid: computed(()=>{
      console.log(newEgress.amountRemoved());
      return newEgress.amountRemoved() != 0 && newEgress.petitionerId() != ''
    })
  }))

);
