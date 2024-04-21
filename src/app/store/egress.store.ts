import { Egress } from "@models/custom/newEgress";
import { patchState, signalStore, withMethods, withState } from "@ngrx/signals";


const initialState: Egress = {
  amountRemoved: 0,
  petitionerId: "",
  supplyId: ""
}


export const EgressStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withMethods((store) => ({
    setPetitionerId(petitionerId: string): void {
      patchState(store, { petitionerId })
    },
    setRemovedAmount(amountRemoved: number): void {
      patchState(store, { amountRemoved })
    },
    setSupplyId(supplyId: string): void {
      patchState(store, { supplyId })
    },
  }))


);
