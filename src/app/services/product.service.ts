import { Injectable } from '@angular/core';
import { HttpBase } from './http-base.service';
import { Product } from '@models/DTO/product';
import { lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService extends HttpBase<Product> {
  constructor() {
    super("Product");
  }

  async loadMissingProductsFromTheAirport(idAirport: string) : Promise<Product[]> {
    return await lastValueFrom(this.http.get<Product[]>(`${this.apiUrl}/GetProductsMissingInAirport?idAirport=${idAirport}`));
  }
}
