import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { HttpGetService } from './http-get.service';
import { ProductDto } from '../../models/Dto/productDto';

@Injectable({
  providedIn: 'root'
})
export class ProductFormatService extends HttpGetService<ProductDto> {
  constructor(http: HttpClient) {
    super(http, "ProductFormat");
  }
}
