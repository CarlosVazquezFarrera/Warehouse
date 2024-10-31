import { Injectable } from '@angular/core';
import { HttpBase } from './http-base.service';
import { Egress } from '@models/DTO/egress';
import { NewAgent } from '@models/types/newAgent';
import { NewEgress } from '@models/types/newEgress';

@Injectable({
  providedIn: 'root'
})
export class EgressService extends HttpBase<Egress, NewEgress> {
  constructor() {
    super("Egress");
  }
}
