import { computed, inject } from "@angular/core";
import { Airport } from "@models/DTO/airport"
import { InventoryItem } from "@models/api/inventoryItem";
import { patchState, signalStore, withComputed, withMethods, withState } from "@ngrx/signals";
import { AirportService } from "@services/airport.service";
import { InventoryService } from "@services/inventory.service";

type DashBoard = {
  airport: Airport[],
  inventory: InventoryItem[]
}

const initialState: DashBoard = {
  airport: [],
  inventory: []
}


export const DasboardStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withMethods((store, airportService = inject(AirportService), inventoryService = inject(InventoryService)) => ({
    async getAiports(): Promise<void> {
      const airports = await airportService.getAll();
      patchState(store, { airport: airports })
    },
    async getInventoryByAirport(id: string): Promise<void> {
      const inventory = await inventoryService.getInventoryByAirport(id);
      patchState(store, { inventory })
    }
  })),
  withComputed(({inventory})=>({
    inventoryCount: computed(()=>inventory().length)
  }))

);
