import { Injectable } from '@angular/core';
import { HttpCrudService } from './http-crud.service';
import { EntryDto } from '@models/Dto/entryDto';
import { HttpClient } from '@angular/common/http';
import { Entry } from '@models/types/entry';

@Injectable({
  providedIn: 'root'
})
export class EntryService extends HttpCrudService<Entry, EntryDto> {
  constructor(http: HttpClient) {
    super(http, "Entry");

  }
}
