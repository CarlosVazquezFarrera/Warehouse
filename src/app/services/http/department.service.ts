import { Injectable } from '@angular/core';
import { HttpGetService } from './http-get.service';
import { DepartmentDto } from '@models/Dto/departmentDto';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class DepartmentService extends HttpGetService<DepartmentDto> {
  constructor(http: HttpClient) {
    super(http, "Department");
  }
}
