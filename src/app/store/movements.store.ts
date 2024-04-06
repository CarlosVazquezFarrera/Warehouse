import { patchState, signalStore, withMethods } from "@ngrx/signals";

type Egress = {
  idPeticioner: string,
  peticionerName: string,
  quantity: number;
}

const initialState: Egress = {
  peticionerName: "",
  idPeticioner: "",
  quantity: 0
}

export const MovementsdStore = signalStore(
  { providedIn: 'root' },
  withMethods((store) => ({
    setPeticioner(idPeticioner: string, peticionerName: string): void {
      patchState(store, { idPeticioner, peticionerName })
    },
    setAcuantity(quantity: number): void {
      patchState(store, { quantity })
    }
  }))
)
