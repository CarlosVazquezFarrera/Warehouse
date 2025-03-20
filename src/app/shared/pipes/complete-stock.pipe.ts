import { DecimalPipe } from '@angular/common';
import { inject, Pipe, PipeTransform } from '@angular/core';
import { Product } from '@models/DTO/product';

@Pipe({
  name: 'completeStock',
  standalone: true
})
export class CompleteStockPipe implements PipeTransform {


  transform(product: Product): string {
    const unitPresentation = product.formatQuantity * product.presentationQuantity;
    const completeStock = product.stock / unitPresentation;

    const factor = Math.pow(10, 2);
    const truncated = Math.trunc(completeStock * factor) / factor;

    // Convertimos a string y armamos los decimales a mano
    let [integerPart, decimalPart = ''] = truncated.toString().split('.');

    // Rellenar con ceros si faltan
    decimalPart = decimalPart.padEnd(2, '0');

    return `${integerPart}.${decimalPart}`;
  }

}
