import { computed, inject } from "@angular/core";
import { environment } from "@environments/environment";
import { Agent } from "@models/DTO/agent";
import { Airport } from "@models/DTO/airport"
import { Egress } from "@models/DTO/egress";
import { InventoryItem } from "@models/api/inventoryItem";
import { Metadata } from "@models/custom/metadata";
import { NewEgress } from "@models/custom/newEgress";
import { patchState, signalStore, withComputed, withMethods, withState } from "@ngrx/signals";
import { AgentService } from "@services/agent.service";
import { AirportService } from "@services/airport.service";
import { EgressService } from "@services/egress.service";
import { InventoryService } from "@services/inventory.service";

type DashBoard = {
  airport: Airport[],
  agents: Agent[],
  inventory: InventoryItem[],
  inventoryMetadata: Metadata,
  newEgress: NewEgress
}
const initialNewEgress: NewEgress = {
  amountRemoved: 0,
  petitionerId: "",
  supplyId: ""
}
const initialState: DashBoard = {
  airport: [],
  inventory: [],
  agents: [],
  newEgress: initialNewEgress,
  inventoryMetadata:{
    totalCount: 0,
    pageSize: 0,
    currentPage: 0,
    totalPages: 0,
    hasPreviousPage: false,
    hasNextPage: false
  }
}


export const DasboardStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withMethods((store,
    airportService = inject(AirportService),
    inventoryService = inject(InventoryService),
    agentService = inject(AgentService),
    egressService = inject(EgressService)
  ) => ({
    async getAiports(): Promise<void> {
      const airports = await airportService.getAll();
      patchState(store, { airport: airports })
    },
    async getInventoryByAirport(id: string, search: string = '', pageNumber: number = environment.pagination.defaultPageNumber, pageSize: number = environment.pagination.defaultPageSize): Promise<void> {
      const pagedInventory = await inventoryService.getInventoryByAirport(id, search, pageNumber, pageSize);
      patchState(store, { inventory: pagedInventory.data });
      patchState(store, { inventoryMetadata: pagedInventory.metadata });
    },
    async getAgents(): Promise<void> {
      const agents = await agentService.getAgents();
      patchState(store, { agents })
    },
    setPetitionerId(petitionerId: string): void {
      const newEgress: NewEgress = { ...store.newEgress(), petitionerId }
      patchState(store, { newEgress })
    },
    setRemovedAmount(amountRemoved: number): void {
      const newEgress: NewEgress = { ...store.newEgress(), amountRemoved }
      patchState(store, { newEgress })
    },
    setSupplyId(supplyId: string): void {
      const newEgress: NewEgress = { ...store.newEgress(), supplyId }
      patchState(store, { newEgress })
    },
    newEgressRegistered(currentQuantity: number, supplyId: string): void {
      const inventory = store.inventory().map(i => {
        if (i.id == supplyId) {
          const newTotal = i.currentQuantity - currentQuantity;
          const newEgress: InventoryItem = { ...i, currentQuantity: newTotal }
          return newEgress;
        }
        return i
      });
      patchState(store, { inventory })
    },
    async saveNewEgress() {
      const egress: Egress = await egressService.post(store.newEgress())
      const inventory = store.inventory().map(i => {
        if (i.id == egress.supplyId) {
          const newEgress: InventoryItem = { ...i, currentQuantity: egress.quantityAfter }
          return newEgress;
        }
        return i
      });
      patchState(store, { inventory })
    }

  })),
  withComputed(({ inventory, newEgress, agents }) => ({
    supplySelected: computed(() => {
      const id = newEgress.supplyId();
      return inventory().find(i => i.id == id);
    }),
    petitionerSelected: computed(() => {
      const id = newEgress.petitionerId();
      const agent = agents().find(a => a.id == id);
      return `${agent?.agentNumber} - ${agent?.name} ${agent?.lastName}`;
    }),
    newAgressValid: computed(() => {
      return newEgress.amountRemoved() != 0 && newEgress.petitionerId() != ''
    })
  }))

);
