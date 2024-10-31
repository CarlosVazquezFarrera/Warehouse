import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appCapitalizeFirst]',
  standalone: true
})
export class CapitalizeFirstDirective {

  constructor(private el: ElementRef) {
  }

  @HostListener('blur', ['$event.target.value'])
  onBlur(value: string) {
    this.el.nativeElement.value = this.capitalizeFirstLetter(value);
  }

  private capitalizeFirstLetter(value: string): string {
    if (!value) return value;
    return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
  }
}
