import { Injectable } from '@angular/core';
import { HttpBase } from './http-base.service';
import { Egress } from '@models/DTO/egress';

@Injectable({
  providedIn: 'root'
})
export class EgressService extends HttpBase<Egress> {
  constructor() {
    super("Egress");
  }
}
