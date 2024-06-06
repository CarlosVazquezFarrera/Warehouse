import { HttpClient } from '@angular/common/http';
import { Injectable, Injector, inject } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { AgentInfo } from '@models/api/agentInfo';
import { environment } from '@environments/environment';
import { AgentLoginCredentials } from '@models/types/agentLoginCredentials';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor() {
    this.apiUrl = `${environment.baseApiUrl}Login`;
  }

  private http: HttpClient = inject(HttpClient);
  private apiUrl: string;



  public async login(agentNumber: string, password: string): Promise<AgentInfo> {
    const agentInfo: AgentLoginCredentials = {
      agentNumber,
      password
    }
    return await lastValueFrom(this.http.post<AgentInfo>(`${this.apiUrl}`, agentInfo))
  }
}
