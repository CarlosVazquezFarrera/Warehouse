import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '@environments/environment';
import { InventoryItem } from '@models/api/inventoryItem';
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

  public async getInventoryByAirport(id: string, search?: string) {
    return await lastValueFrom(this.http.get<InventoryItem[]>(`${this.apiUrl}?idAiport=${id}&search=${search}`));
  }
}
