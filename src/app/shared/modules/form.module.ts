import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalHeaderComponent } from '@shared/components/modal-header/modal-header.component';
import { CapitalizeFirstDirective } from '@shared/directives/capitalize-first.directive';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ModalHeaderComponent,
    CapitalizeFirstDirective
  ],
  exports: [
    ModalHeaderComponent,
    CapitalizeFirstDirective
  ]
})
export class FormModule { }