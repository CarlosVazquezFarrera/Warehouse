import { HttpClient } from '@angular/common/http';
import { Injectable, Injector, inject } from '@angular/core';
import { environment } from '../../environments/environment';
import { lastValueFrom } from 'rxjs';
import { AgentInfo } from '@models/api/agentInfo';
import { AgentLogin } from '@models/custom/agentLogin';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor() {
    this.apiUrl = `${environment.baseApiUrl}Login`;
  }

  private http: HttpClient = inject(HttpClient);
  private injector = inject(Injector);
  private apiUrl: string;



  public async login(agentNumber: number, password: string): Promise<AgentInfo> {
    const agentInfo: AgentLogin = {
      agentNumber,
      password
    }
    return await lastValueFrom(this.http.post<AgentInfo>(`${this.apiUrl}`, agentInfo))
  }
}
