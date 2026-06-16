import { Injectable } from '@angular/core';
import { HttpGetService } from './http-get.service';
import { PresentationDto } from '@models/Dto/presentationDto';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class PresentationService extends HttpGetService<PresentationDto> {
  constructor(http: HttpClient) {
    super(http, "Presentation");

  }
}
