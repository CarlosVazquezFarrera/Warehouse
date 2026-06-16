import { Injectable } from '@angular/core';
import { HttpCrudService } from './http-crud.service';
import { Egress } from '@models/types/egress';
import { EgressDto } from '@models/Dto/egressDto';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class EgressService extends HttpCrudService<Egress, EgressDto> {
  constructor(http: HttpClient) {
    super(http, "Egress");

  }
}
