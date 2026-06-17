import { Injectable } from '@angular/core';
import { HttpGetService } from './http-get.service';
import { HttpClient } from '@angular/common/http';
import { DepartmentDto } from '../../models/Dto/departmentDto';


@Injectable({
  providedIn: 'root'
})
export class DepartmentService extends HttpGetService<DepartmentDto> {
  constructor(http: HttpClient) {
    super(http, "Department");
  }
}
