import { InjectionToken, computed, inject } from "@angular/core";
import { patchState, signalStore, withComputed, withMethods, withState } from "@ngrx/signals";
import { LoginService } from "@services/login.service";
import { SessionService } from "@services/session.service";
import { AgentLogin } from "@models/types/agentLogin";

type Warehouse = {
  agent: AgentLogin,
  isOpen: boolean,
  token: string
}

const initialState: Warehouse = {
  isOpen: false,
  agent: {
    agentNumber: 0,
    shortName: '',
    name: '',
    lastName: '',
    email: '',
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
    async login(agentNumber: number, passWord: string): Promise<void> {
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
