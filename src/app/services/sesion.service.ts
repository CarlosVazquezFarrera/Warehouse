import { Injectable } from '@angular/core';
import { Agent } from '@models/DTO/agent';
import { AgentInfo } from '@models/api/agentInfo';

type SesionKey = 'token' | 'agent'

@Injectable({
  providedIn: 'root'
})
export class SesionService {
  constructor() {
    const agent = this.getAgentUser();
    this.currentUserIsloggedIn = agent ? true: false;
  }
  private currentUserIsloggedIn: boolean = false;

  public login(agentInfo: AgentInfo) {
    const agent: SesionKey = 'agent';
    sessionStorage.setItem(agent, JSON.stringify(agentInfo.agent));
    const token: SesionKey = 'token'
    sessionStorage.setItem(token, JSON.stringify(agentInfo.token));
    this.currentUserIsloggedIn = true;
  }

  public getAgentUser(): Agent | undefined {
    const agent: SesionKey = 'agent';
    const value = sessionStorage.getItem(agent);
    if (value) {
      const agent: Agent = JSON.parse(value);
      return agent;
    }

    return undefined;
  }

  public logOut() {
    sessionStorage.clear();
    this.currentUserIsloggedIn = false;
  }

  public get isLoggedIn (): boolean {
    return this.currentUserIsloggedIn;
  }

}
