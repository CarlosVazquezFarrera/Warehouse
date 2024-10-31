import { InjectionToken, computed, inject } from "@angular/core";
import { AgentBaseInfo } from "@models/types/agentBaseInfo";
import { patchState, signalStore, withComputed, withMethods, withState } from "@ngrx/signals";
import { LoginService } from "@services/login.service";
import { SessionService } from "@services/session.service";

type Warehouse = {
  agent: AgentBaseInfo,
  isOpen: boolean,
  token: string
}

const initialState: Warehouse = {
  isOpen: false,
  agent: {
    agentNumber: "",
    shortName: "",
    name: "",
    lastName: "",
    email: "",
    id: "",
    airportId: ""
  },
  token: ""
};

const WarehouseState = new InjectionToken<Warehouse>('Warehouse', {
  factory: () => {
    let sessionService = inject(SessionService);
    const agent = sessionService.getAgentUser();
    if (agent) {
      const loggedInState: Warehouse = {
        isOpen: false,
        agent,
        token: ""
      }
      return loggedInState;
    }
    return initialState
  },
});


export const WarehouseStore = signalStore(
  { providedIn: 'root' },
  withState(() => inject(WarehouseState)),
  withMethods((store, loginService = inject(LoginService)) => ({
    async login(agentNumber: string, passWord: string): Promise<void> {
      const agentInfo = await loginService.login(agentNumber, passWord);

      patchState(store, (_) => ({
        agent: agentInfo.agent,
        token: agentInfo.token

      }));
    },
    logOut(): void {
      patchState(store, initialState)
    },
    toggleMenu(): void {
      patchState(store, { isOpen: !store.isOpen() });
    },
  })),
  withComputed(({agent})=>({
    fullName: computed(() => `${agent().name} ${agent().lastName}`),
  }))
);
