import { NgModule } from '@angular/core';
import { AsyncPipe, CommonModule, DatePipe } from '@angular/common';
import { ModalHeaderComponent } from '@shared/components/modal-header/modal-header.component';
import { CapitalizeFirstDirective } from '@shared/directives/capitalize-first.directive';
import { UppercaseDirective } from '@shared/directives/uppercase.directive';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ModalHeaderComponent,
    CapitalizeFirstDirective,
    UppercaseDirective,
    AsyncPipe,
    DatePipe
  ],
  exports: [
    ModalHeaderComponent,
    CapitalizeFirstDirective,
    AsyncPipe,
    DatePipe,
    UppercaseDirective
  ]
})
export class FormModule { }
