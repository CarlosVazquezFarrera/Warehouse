import { Injectable } from '@angular/core';
import { HttpCrudService } from './http-crud.service';
import { HttpClient } from '@angular/common/http';
import { Product } from '../../models/types/product';
import { ProductDto } from '../../models/Dto/productDto';
import { PagedResult } from '../../models/custom/pagedResult';


@Injectable({
  providedIn: 'root'
})
export class ProductService extends HttpCrudService<Product, ProductDto> {
  constructor(http: HttpClient) {
    super(http, 'Product');
  }

  override async search<ProductSearch>(searchParams?: ProductSearch, page?: number, pageSize?: number, action?: string): Promise<PagedResult<ProductDto>> {
    return super.search<ProductSearch>(searchParams, page, pageSize);
  }
}
