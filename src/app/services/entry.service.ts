import { Injectable } from '@angular/core';
import { HttpBase } from './http-base.service';
import { Entry } from '@models/DTO/entry';

@Injectable({
  providedIn: 'root'
})
export class EntryService extends HttpBase<Entry> {
  constructor() {
    super("Entry");
  }
}
