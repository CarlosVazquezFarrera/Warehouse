import { Injectable } from '@angular/core';
import { HttpGetService } from './http-get.service';
import { HttpClient } from '@angular/common/http';
import { PresentationDto } from '../../models/Dto/presentationDto';


@Injectable({
  providedIn: 'root'
})
export class PresentationService extends HttpGetService<PresentationDto> {
  constructor(http: HttpClient) {
    super(http, "Presentation");

  }
}
