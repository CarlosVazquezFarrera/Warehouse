import { InjectionToken, computed, inject } from "@angular/core";
import { Router } from "@angular/router";
import { Agent } from "@models/DTO/agent";
import { patchState, signalStore, withComputed, withMethods, withState } from "@ngrx/signals";
import { LoginService } from "@services/login.service";
import { SesionService } from "@services/sesion.service";
import { AgentInfo } from '@models/api/agentInfo';

type Warehouse = {
  agent: Agent,
  isOpen: boolean,
  isLoading: boolean
}

const initialState: Warehouse = {
  isOpen: false,
  isLoading: false,
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
    let sesionService = inject(SesionService);
    const agent = sesionService.getAgentUser();
    if (agent) {
      const loggedInState: Warehouse = {
        isOpen: true,
        isLoading: false,
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
  withMethods((store, loginService = inject(LoginService), router = inject(Router), sesionService = inject(SesionService)) => ({
    async login(agentNumber: number, passWord: string): Promise<AgentInfo> {
      patchState(store, { isLoading: true });
      const agentInfo = await loginService.login(agentNumber, passWord);
      patchState(store, { agent: agentInfo.agent, isLoading: false });
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
