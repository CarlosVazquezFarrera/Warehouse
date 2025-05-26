import { animate, style, transition, trigger } from "@angular/animations";

export const inOut = trigger("inOut", [
    transition(":enter", [
      style({ opacity: 0, transform: "translateX(-100%)" }), 
      animate(
        "750ms ease-in-out",
        style({ opacity: 1, transform: "translateX(0)" })
      )
    ]),
    transition(":leave", [
      style({ opacity: 1, transform: "translateX(0)" }), 
      animate(
        "600ms ease-in-out",
        style({ opacity: 0, transform: "translateX(-100%)" })
      )
    ])
  ])