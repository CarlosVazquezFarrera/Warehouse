import { Injectable } from '@angular/core';
import { HttpBase } from './http-base.service';
import { Category } from '@models/DTO/category';
import { NewCategory } from '@models/types/newCategory';

@Injectable({
  providedIn: 'root'
})
export class CategoryService extends HttpBase<Category, NewCategory> {
  constructor() { 
    super("Category");
  }
}
