import { Injectable } from '@angular/core';
import { HttpBase } from './http-base.service';
import { Product } from '@models/DTO/product';

@Injectable({
  providedIn: 'root'
})
export class ProductService extends HttpBase<Product> {
  constructor() {
    super("Product");
  }
}
