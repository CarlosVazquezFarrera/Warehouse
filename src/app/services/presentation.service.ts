import { Injectable } from '@angular/core';
import { HttpBase } from './http-base.service';
import { Presentation } from '@models/DTO/presentation';
import { NewPresentation } from '@models/types/newPresentation';

@Injectable({
  providedIn: 'root'
})
export class PresentationService extends HttpBase<Presentation, NewPresentation> {

  constructor() { 
    super("Presentation");
  }
}
