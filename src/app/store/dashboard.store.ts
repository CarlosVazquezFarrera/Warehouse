import { computed, inject } from "@angular/core";
import { Agent } from "@models/DTO/agent";
import { Airport } from "@models/DTO/airport"
import { Egress } from "@models/DTO/egress";
import { InventoryItem } from "@models/api/inventoryItem";
import { Metadata } from "@models/custom/metadata";
import { patchState, signalStore, withComputed, withMethods, withState } from "@ngrx/signals";
import { AgentService } from "@services/agent.service";
import { AirportService } from "@services/airport.service";
import { EgressService } from "@services/egress.service";
import { InventoryService } from "@services/inventory.service";
import { NewEgress } from "@models/types/newEgress";
import { EntryService } from "@services/entry.service";
import { NewEntry } from "@models/types/newEntry";
import { Entry } from "@models/DTO/entry";
import { Product } from "@models/DTO/product";
import { ProductService } from "@services/product.service";
import { PagedResponse } from "@models/custom/pagedResonse";

type DashBoard = {
  airport: Airport[],
  agents: Agent[],
  inventory: PagedResponse<InventoryItem>,
  newEgress: NewEgress,
  supplySelected: InventoryItem,
  products: PagedResponse<Product>
}
const initialNewEgress: NewEgress = {
  amountRemoved: 0,
  petitionerId: "",
  supplyId: ""
}

const initialMetadata: Metadata = {
  totalCount: 0,
  pageSize: 0,
  currentPage: 0,
  totalPages: 0,
  hasPreviousPage: false,
  hasNextPage: false
};
const supplySelected: InventoryItem = {
  id: "",
  name: "",
  airport: "",
  supplierPart: "",
  currentQuantity: 0
}
const initialState: DashBoard = {
  airport: [],
  inventory: {
    data: [],
    metadata: initialMetadata
  },
  agents: [],
  newEgress: initialNewEgress,
  supplySelected,
  products: {
    data: [],
    metadata: initialMetadata
  }
}


export const DashboardStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withMethods((store,
    airportService = inject(AirportService),
    inventoryService = inject(InventoryService),
    agentService = inject(AgentService),
    egressService = inject(EgressService),
    entryService = inject(EntryService),
    productService = inject(ProductService)
  ) => ({
    async getAiports(): Promise<void> {
      const airports = await airportService.getAll();
      patchState(store, { airport: airports })
    },
    async getInventoryByAirport(id: string, search: string = '', pageNumber?: number, pageSize?: number): Promise<void> {
      const inventory = await inventoryService.getInventoryByAirport(id, search, pageNumber, pageSize);
      patchState(store, { inventory });
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
    setSupplySelected(supply: InventoryItem): void {
      const newEgress: NewEgress = { ...store.newEgress(), supplyId: supply.id }
      patchState(store, { newEgress });
      patchState(store, { supplySelected: supply });
    },
    newEgressRegistered(currentQuantity: number, supplyId: string): void {
      const data = store.inventory.data().map(i => {
        if (i.id == supplyId) {
          const newTotal = i.currentQuantity - currentQuantity;
          const newEgress: InventoryItem = { ...i, currentQuantity: newTotal }
          return newEgress;
        }
        return i;
      });

      const inventory: PagedResponse<InventoryItem> = {
        data,
        metadata: { ...store.inventory.metadata() }
      };
      patchState(store, { inventory });

    },
    async saveNewEgress() {
      const egress: Egress = await egressService.post<Egress, NewEgress>(store.newEgress())
      const data = store.inventory.data().map(i => {
        if (i.id == egress.supplyId) {
          const newEgress: InventoryItem = { ...i, currentQuantity: egress.quantityAfter }
          return newEgress;
        }
        return i
      });
      const inventory: PagedResponse<InventoryItem> = {
        data,
        metadata: { ...store.inventory.metadata() }
      };
      patchState(store, { inventory });
    },
    async loadSupply(IdSupply: string): Promise<void> {
      const item = await inventoryService.getItemByAirportAndIdSupply(IdSupply);
      if (!item) return;
      const newEgress: NewEgress = { ...store.newEgress(), supplyId: item.id }
      patchState(store, { newEgress });
      patchState(store, { supplySelected: { ...item } });
    },
    async saveNewEntry(quantityIncoming: number): Promise<void> {
      const newEntry: NewEntry = {
        supplyId: store.supplySelected.id(),
        quantityIncoming
      }
      const savedEntry: Entry = await entryService.post<Entry, NewEntry>(newEntry);
      const data = store.inventory.data().map(i => {
        if (i.id == savedEntry.supplyId) {
          const newEgress: InventoryItem = { ...i, currentQuantity: savedEntry.quantityAfter }
          return newEgress;
        }
        return i
      });

      const inventory: PagedResponse<InventoryItem> = {
        data,
        metadata: { ...store.inventory.metadata() }
      };
      patchState(store, { inventory });
    },
    async loadProducts( pageNumber?: number, pageSize?: number): Promise<void> {
      const products = await productService.getPagedAll<Product>(pageNumber, pageSize);
      patchState(store, { products });
    }

  })),
  withComputed(({ newEgress, agents, supplySelected }) => ({
    petitionerSelected: computed(() => {
      const id = newEgress.petitionerId();
      const agent = agents().find(a => a.id == id);
      return `${agent?.agentNumber} - ${agent?.name} ${agent?.lastName}`;
    }),
    fullNameSupplySelected: computed(() => {
      const supplierPart = supplySelected.supplierPart?.();
      if (!supplierPart)
        return supplySelected.name();

      return `${supplySelected.name()} ${supplierPart}`

    }),
    newAgressValid: computed(() => {
      return newEgress.amountRemoved() != 0 && newEgress.petitionerId() != ''
    })
  }))

);
