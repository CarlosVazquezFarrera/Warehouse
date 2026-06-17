import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { environment } from '@environments/environment';
import { AgentDto } from '../../models/Dto/agentDto';


@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private http: HttpClient) {
    this.apiUrl = `${environment.API_BASE_URL}Login`;
  }

  private apiUrl: string;

  public async login(agentNumber: string, password: string): Promise<AgentDto> {
    return await lastValueFrom(this.http.post<AgentDto>(`${this.apiUrl}`, { agentNumber, password }))
  }
}
