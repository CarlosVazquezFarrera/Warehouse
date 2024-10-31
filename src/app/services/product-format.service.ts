import { Injectable } from '@angular/core';
import { HttpBase } from './http-base.service';
import { ProductFormat } from '@models/DTO/productFormat';
import { NewProductFormat } from '@models/types/newProductFormat';

@Injectable({
  providedIn: 'root'
})
export class ProductFormatService extends HttpBase<ProductFormat, NewProductFormat> {
  constructor() { 
    super("ProductFormat");
  }
}
