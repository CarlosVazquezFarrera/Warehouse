import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '@environments/environment';
import { Airport } from '@models/DTO/airport';
import { Observable, lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AirportService {

  constructor() {
    this.apiUrl = `${environment.baseApiUrl}Airport`;
  }

  private http: HttpClient = inject(HttpClient);
  private apiUrl: string;

  public async getAll(): Promise<Array<Airport>> {
    return await lastValueFrom(this.http.get<Airport[]>(`${this.apiUrl}`));
  }
}
