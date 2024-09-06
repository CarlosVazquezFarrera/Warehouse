import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '@environments/environment';
import { PagedResponse } from '@models/custom/pagedResonse';
import { AgentBaseInfo } from '@models/types/agentBaseInfo';
import { lastValueFrom } from 'rxjs';
import { HttpBase } from './http-base.service';
import { AgentPasswordInfo } from '@models/types/agentPasswordInfo';

@Injectable({
  providedIn: 'root'
})
export class AgentService extends HttpBase<AgentBaseInfo> {
  constructor() {
    super("Agent");
  }

  public async setPassword(agentPasswordInfo: AgentPasswordInfo): Promise<boolean> {
    this.http.patch(this.apiUrl, agentPasswordInfo);
    return await lastValueFrom(this.http.patch<boolean>(`${this.apiUrl}/SetPassword`, agentPasswordInfo));
  }
}
