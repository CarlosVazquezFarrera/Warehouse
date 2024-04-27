import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '@environments/environment';
import { InventoryItem } from '@models/api/inventoryItem';
import { PagedResponse } from '@models/custom/pagedResonse';
import { lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InventoryService {


  constructor() {
    this.apiUrl = `${environment.baseApiUrl}Inventory`;
  }

  private http: HttpClient = inject(HttpClient);
  private apiUrl: string;

  public async getInventoryByAirport(id: string, search: string, pageNumber: number, pageSize: number) {
    return await lastValueFrom(this.http.get<PagedResponse<InventoryItem>>(`${this.apiUrl}?idAiport=${id}&search=${search}&pageNumber=${pageNumber}&pageSize=${pageSize}`));
  }
}
