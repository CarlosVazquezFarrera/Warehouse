import { Injectable } from '@angular/core';
import { HttpBase } from './http-base.service';
import { PackagingType } from '@models/DTO/packagingType';
import { NewPackagingType } from '@models/types/newPackagingType';

@Injectable({
  providedIn: 'root'
})
export class PackagingTypeService extends HttpBase<PackagingType, NewPackagingType> {
  constructor() { 
    super("PackagingType");
  }
}
