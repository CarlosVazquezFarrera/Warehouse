import { Injectable } from '@angular/core';
import { CategoryDto } from '@models/Dto/categoryDto';
import { HttpClient } from '@angular/common/http';
import { HttpGetService } from './http-get.service';

@Injectable({
  providedIn: 'root'
})
export class CategoryService extends HttpGetService<CategoryDto> {
  constructor(http: HttpClient) {
    super(http, "Category");

  }
}
