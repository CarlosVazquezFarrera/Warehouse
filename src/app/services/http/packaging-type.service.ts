import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpGetService } from './http-get.service';
import { PackagingTypeDto } from '../../models/Dto/packagingTypeDto';

@Injectable({
  providedIn: 'root'
})
export class PackagingTypeService extends HttpGetService<PackagingTypeDto>  {
  constructor(http: HttpClient) {
    super(http, "PackagingType");
  }
}
