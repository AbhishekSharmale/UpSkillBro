import { trigger, state, style, transition, animate, query, stagger, keyframes } from '@angular/animations';

export const fadeInUp = trigger('fadeInUp', [
  transition(':enter', [
    style({ opacity: 0, transform: 'translateY(30px)' }),
    animate('0.6s ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
  ])
]);

export const staggerAnimation = trigger('stagger', [
  transition('* => *', [
    query(':enter', [
      style({ opacity: 0, transform: 'translateY(20px)' }),
      stagger(100, [
        animate('0.5s ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ], { optional: true })
  ])
]);

export const scaleIn = trigger('scaleIn', [
  transition(':enter', [
    style({ opacity: 0, transform: 'scale(0.8)' }),
    animate('0.4s ease-out', style({ opacity: 1, transform: 'scale(1)' }))
  ])
]);

export const slideInLeft = trigger('slideInLeft', [
  transition(':enter', [
    style({ opacity: 0, transform: 'translateX(-50px)' }),
    animate('0.5s ease-out', style({ opacity: 1, transform: 'translateX(0)' }))
  ])
]);

export const progressAnimation = trigger('progressAnimation', [
  transition(':enter', [
    style({ width: '0%' }),
    animate('1s ease-out', style({ width: '{{width}}%' }))
  ])
]);

export const pulseAnimation = trigger('pulse', [
  state('active', style({ transform: 'scale(1.05)' })),
  state('inactive', style({ transform: 'scale(1)' })),
  transition('inactive => active', animate('0.3s ease-in-out')),
  transition('active => inactive', animate('0.3s ease-in-out'))
]);

export const countUp = trigger('countUp', [
  transition(':increment', [
    animate('0.5s ease-out', keyframes([
      style({ transform: 'scale(1)', offset: 0 }),
      style({ transform: 'scale(1.1)', offset: 0.5 }),
      style({ transform: 'scale(1)', offset: 1 })
    ]))
  ])
]);