import { InjectionToken, computed, inject } from "@angular/core";
import { Agent } from "@models/DTO/agent";
import { patchState, signalStore, withComputed, withMethods, withState } from "@ngrx/signals";
import { LoginService } from "@services/login.service";
import { AgentInfo } from '@models/api/agentInfo';
import { SessionService } from "@services/session.service";

type Warehouse = {
  agent: Agent,
  isOpen: boolean,
}

const initialState: Warehouse = {
  isOpen: false,
  agent: {
    id: '',
    agentNumber: 0,
    shortName: '',
    name: '',
    lastName: '',
    email: '',
    password: ''
  }
};

const WarehouseState = new InjectionToken<Warehouse>('Warehouse', {
  factory: () => {
    let sessionService = inject(SessionService);
    const agent = sessionService.getAgentUser();
    if (agent) {
      const loggedInState: Warehouse = {
        isOpen: false,
        agent
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
    async login(agentNumber: number, passWord: string): Promise<AgentInfo> {
      const agentInfo = await loginService.login(agentNumber, passWord);
      patchState(store, { agent: agentInfo.agent});
      return agentInfo;
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
