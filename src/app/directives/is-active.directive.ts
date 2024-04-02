import { Directive, ElementRef, Input, OnChanges, Renderer2, SimpleChanges, inject, input } from '@angular/core';
import { IsActiveMatchOptions, NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';

@Directive({
  selector: '[appIsActive]',
  standalone: true
})
export class IsActiveDirective implements OnChanges {

  constructor() {
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd),
    ).subscribe(() => this.toggleClass());
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log(changes)
    if (changes['url'].currentValue && changes['url'].firstChange)
      this.toggleClass();
  }

  private router = inject(Router);
  private renderer = inject(Renderer2);
  private elementRef = inject(ElementRef);

  public url = input<string>('');
  public customClass = input<string>('is-activated');

  private toggleClass(): void {
    if (this.isActivated) {
      this.renderer.addClass(this.elementRef.nativeElement, this.customClass())
    }
    else {
      this.renderer.removeClass(this.elementRef.nativeElement, this.customClass());
    }
  }

  public get isActivated(): boolean {
    const option: IsActiveMatchOptions = { paths: 'exact', queryParams: 'exact', fragment: 'ignored', matrixParams: 'ignored' }
    return this.router.isActive(this.url(), option);
  };

}
