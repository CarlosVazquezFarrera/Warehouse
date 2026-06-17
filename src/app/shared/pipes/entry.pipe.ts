import { Pipe, PipeTransform } from '@angular/core';
import { ProductDto } from '../../models/Dto/productDto';

@Pipe({
  name: 'entry',
  standalone: true
})
export class EntryPipe implements PipeTransform {

  transform(product?: ProductDto, quantity?: string): number {
    const totalUnits = product!.presentationQuantity * product!.formatQuantity;
    return totalUnits * Number(quantity);
  }

}
