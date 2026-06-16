import { Injectable } from '@angular/core';
import { HttpCrudService } from './http-crud.service';
import { Entry } from '@models/types/Entry';
import { EntryDto } from '@models/Dto/entryDto';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class EntryService extends HttpCrudService<Entry, EntryDto> {
  constructor(http: HttpClient) {
    super(http, "Entry");

  }
}
