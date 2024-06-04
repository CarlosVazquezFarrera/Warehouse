import { Injectable } from '@angular/core';
import { HttpBase } from './http-base.service';
import { Supply } from '@models/DTO/supply';

@Injectable({
  providedIn: 'root'
})
export class SupplyService extends HttpBase<Supply> {
  constructor() {
    super("Supply");
  }
}
