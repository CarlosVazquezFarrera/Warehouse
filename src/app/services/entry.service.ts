import { Injectable } from '@angular/core';
import { HttpBase } from './http-base.service';
import { Entry } from '@models/DTO/entry';
import { NewEntry } from '@models/types/newEntry';

@Injectable({
  providedIn: 'root'
})
export class EntryService extends HttpBase<Entry, NewEntry> {
  constructor() {
    super("Entry");
  }
}
