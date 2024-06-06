import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '@environments/environment';
import { PagedResponse } from '@models/custom/pagedResonse';
import { AgentBaseInfo } from '@models/types/agentBaseInfo';
import { lastValueFrom } from 'rxjs';
import { HttpBase } from './http-base.service';

@Injectable({
  providedIn: 'root'
})
export class AgentService extends HttpBase<AgentBaseInfo> {
  constructor() {
    super("Agent");

  }
}
