import { Injectable } from '@angular/core';
import { AgentDto } from '../models/Dto/agentDto';

@Injectable({
  providedIn: 'root'
})
export class SessionService {
  constructor() {
    const agent = this.getAgentUser();
    this.currentUserIsloggedIn = agent ? true : false;
  }
  private agentKey = 'agent';
  private currentUserIsloggedIn: boolean = false;

  public login(agentInfo: AgentDto) {
    sessionStorage.setItem(this.agentKey, JSON.stringify(agentInfo));
    this.currentUserIsloggedIn = true;
  }

  public getAgentUser(): AgentDto | undefined {
    const value = sessionStorage.getItem(this.agentKey);
    if (value) {
      const agent: AgentDto = JSON.parse(value);
      return agent;
    }
    return undefined;
  }

  public logOut() {
    sessionStorage.clear();
    this.currentUserIsloggedIn = false;
  }

  public get isLoggedIn(): boolean {
    return this.currentUserIsloggedIn;
  }

  public get token(): string | undefined {
    return this.getAgentUser()?.token;
  }

}
