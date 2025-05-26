import { trigger, transition, style, animate, keyframes } from '@angular/animations';

export const bounceIn = trigger('bounceIn', [
  transition(':enter', [
    animate(
      '1s ease-out',
      keyframes([
        style({ opacity: 0, transform: 'scale(0.3)', offset: 0 }),
        style({ transform: 'scale(1.1)', offset: 0.2 }),
        style({ transform: 'scale(0.9)', offset: 0.4 }),
        style({ transform: 'scale(1.03)', offset: 0.6 }),
        style({ transform: 'scale(0.97)', offset: 0.8 }),
        style({ opacity: 1, transform: 'scale(1)', offset: 1 })
      ])
    )
  ])
]);