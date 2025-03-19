import { Pipe, PipeTransform } from '@angular/core';
import { Product } from '@models/DTO/product';

@Pipe({
  name: 'completeStock',
  standalone: true
})
export class CompleteStockPipe implements PipeTransform {

  transform(product: Product): string {
    const unitPresentation = product.formatQuantity * product.presentationQuantity;
    const completeStock = product.stock / unitPresentation;
    return completeStock.toFixed(1)
  }

}
