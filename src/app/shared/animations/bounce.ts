import { animate, style, transition, trigger } from "@angular/animations";

export const bounce = trigger('bounce', [
  transition(':enter', [
    style({ transform: 'translateY(-100%)' }),
    animate('0.5s ease-out', style({ transform: 'translateY(0)' })),
    animate('0.2s ease-in', style({ transform: 'translateY(-10%)' })),
    animate('0.1s ease-out', style({ transform: 'translateY(0)' }))
  ]),
  transition(':leave', [
    style({ opacity: 1, transform: "translateY(0)" }),
    animate(
      "600ms ease-in-out",
      style({ opacity: 0, transform: "translateY(-100%)" })
    )
  ]
  )
]);