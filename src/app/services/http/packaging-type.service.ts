import { Injectable } from '@angular/core';
import { PackagingTypeDto } from '@models/Dto/packagingTypeDto';
import { HttpClient } from '@angular/common/http';
import { HttpGetService } from './http-get.service';

@Injectable({
  providedIn: 'root'
})
export class PackagingTypeService extends HttpGetService<PackagingTypeDto>  {
  constructor(http: HttpClient) {
    super(http, "PackagingType");
  }
}
