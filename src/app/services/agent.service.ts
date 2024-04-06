import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '@environments/environment';
import { Agent } from '@models/DTO/agent';
import { lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AgentService {

  constructor() {
    this.apiUrl = `${environment.baseApiUrl}Agent`;
  }

  private http: HttpClient = inject(HttpClient);
  private apiUrl: string;

public async getAgents(): Promise<Agent[]> {
  return await lastValueFrom(this.http.get<Agent[]>(`${this.apiUrl}`));
}
}
