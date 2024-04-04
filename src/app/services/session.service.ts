import { Injectable } from '@angular/core';
import { Agent } from '@models/DTO/agent';
import { AgentInfo } from '@models/api/agentInfo';
type SessionKey = 'token' | 'agent'

@Injectable({
  providedIn: 'root'
})
export class SessionService {

  constructor() {
    const agent = this.getAgentUser();
    this.currentUserIsloggedIn = agent ? true: false;
  }
  private currentUserIsloggedIn: boolean = false;

  public login(agentInfo: AgentInfo) {
    const agent: SessionKey = 'agent';
    sessionStorage.setItem(agent, JSON.stringify(agentInfo.agent));
    const token: SessionKey = 'token'
    sessionStorage.setItem(token, JSON.stringify(agentInfo.token));
    this.currentUserIsloggedIn = true;
  }

  public getAgentUser(): Agent | undefined {
    const agent: SessionKey = 'agent';
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

  public get token(): string {
    const token: SessionKey = 'token';
    const value = sessionStorage.getItem(token);
    return JSON.parse(value!);
  }

}
