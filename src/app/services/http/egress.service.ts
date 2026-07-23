import { Injectable } from '@angular/core';
import { HttpCrudService } from './http-crud.service';
import { Egress } from '@models/types/egress';
import { EgressDto } from '@models/Dto/egressDto';
import { HttpClient } from '@angular/common/http';
import { PagedResult } from '@models/custom/pagedResult';
import { environment } from '@environments/environment';
import { lastValueFrom } from 'rxjs';
import { LedgerEgressParams } from '@models/requestParams/ledgerEgressParams';
import { TotalEgressMovementDto } from '@models/Dto/totalEgressMovementDto';

@Injectable({
  providedIn: 'root'
})
export class EgressService extends HttpCrudService<Egress, EgressDto> {
  constructor(http: HttpClient) {
    super(http, "Egress");
  }

  override async search<ActivityEngressParams>(egressParams?: ActivityEngressParams, page?: number, pageSize?: number, action?: string): Promise<PagedResult<EgressDto>> {
    return super.search<ActivityEngressParams>(egressParams, page, pageSize);
  }

  public totalUnitRemoved(searchParams: LedgerEgressParams | null, page: number = environment.pagination.defaultPageNumber, pageSize: number = environment.pagination.defaultPageSize) {
    const params = this.buildQueryParams({
      ...this.normalizeSearchParams(searchParams),
      page,
      pageSize,
    });
    return lastValueFrom(this.http.get<PagedResult<TotalEgressMovementDto>>(`${this.apiUrl}/TotalUnitRemoved`, { params }));
  }


}
