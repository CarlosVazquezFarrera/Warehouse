import { Injectable } from '@angular/core';
import { HttpBase } from './http-base.service';
import { Supply } from '@models/Dto/supply';
import { NewSupply } from '@models/types/newSupply';

@Injectable({
  providedIn: 'root'
})
export class SupplyService extends HttpBase<Supply, NewSupply> {
  constructor() {
    super("Supply");
  }
}
