import { Injectable } from '@angular/core';
import { HttpBase } from './http-base.service';
import { Department } from '@models/DTO/department';
import { NewDepartment } from '@models/types/newDepartment';

@Injectable({
  providedIn: 'root'
})
export class DepartmentService extends HttpBase<Department, NewDepartment> {
  constructor() {
    super("Department");
  }
}
