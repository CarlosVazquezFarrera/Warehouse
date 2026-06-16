import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'numberFormat',
  standalone: true
})
export class NumberFormatPipe implements PipeTransform {

  transform(value: number | string | null | undefined): string {
    if (value === null || value === undefined || value === '') {
      return '';
    }

    const num = typeof value === 'string' ? parseFloat(value) : value;

    if (isNaN(num)) {
      return '';
    }

    // Redondear al número entero más cercano
    const rounded = Math.round(num);

    // Formatear con separadores de miles (comas)
    return rounded.toLocaleString('es-ES');
  }

}
