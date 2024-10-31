import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '@environments/environment';
import { InventoryItem } from '@models/api/inventoryItem';
import { PagedResponse } from '@models/custom/pagedResonse';
import { lastValueFrom } from 'rxjs';
import { HttpBase } from './http-base.service';

@Injectable({
  providedIn: 'root'
})
export class InventoryService extends HttpBase<InventoryItem, InventoryItem>{

  constructor() {
    super("Inventory")
  }
  public async getInventoryByAirport(id: string, search: string = '', pageNumber?: number, pageSize?: number) {
    pageNumber = pageNumber ?? this.pageNumber;
    pageSize = pageSize ?? this.pageSize;
    return await lastValueFrom(this.http.get<PagedResponse<InventoryItem>>(`${this.apiUrl}?idAiport=${id}&search=${search}&pageNumber=${pageNumber}&pageSize=${pageSize}`));
  }

  public async getItemByAirportAndIdSupply(idSupply: string) {
    return await lastValueFrom(this.http.get<InventoryItem>(`${this.apiUrl}/GetSuplyByIdAndAirport?IdSupply=${idSupply}`));
  }
}
