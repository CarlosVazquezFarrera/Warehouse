import { Injectable } from '@angular/core';
import { HttpCrudService } from './http-crud.service';
import { HttpClient } from '@angular/common/http';
import { Egress } from '../../models/types/egress';
import { EgressDto } from '../../models/Dto/egressDto';

@Injectable({
  providedIn: 'root'
})
export class EgressService extends HttpCrudService<Egress, EgressDto> {
  constructor(http: HttpClient) {
    super(http, "Egress");

  }
}
