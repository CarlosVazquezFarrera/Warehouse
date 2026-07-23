import { DatePipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';
type CustomFormatDates = 'dd/MM/yyyy' | 'MM/dd/yyyy';

@Pipe({
  name: 'customDate',
  standalone: true
})


export class CustomDatePipe implements PipeTransform {
  private datePipe = new DatePipe('en-US');

  transform(value: Date, format: CustomFormatDates = 'dd/MM/yyyy'): string {
    return this.datePipe.transform(value, format) ?? 'Invalid Date';
  }

}
