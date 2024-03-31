import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AppRoutes } from '@routes/app-routers';
import { SesionService } from '@services/sesion.service';

export const sesionGuard: CanActivateFn = (route, state) => {
  return true;
};

// export function sesionGuard(allowIfIsLoggeIn: boolean): CanActivateFn {
//   return (route, state) => {
//     const sesionService = inject(SesionService);
//     const router = inject(Router);
//     if (allowIfIsLoggeIn) {
//       if (sesionService.isLoggedIn)
//         return true ;
//       else {
//         router.navigateByUrl(AppRoutes.login);
//         return false;
//       }
//     }
//     else {
//       if (!sesionService.isLoggedIn)
//         return true;
//       else {
//         router.navigateByUrl(AppRoutes.dashboard);
//         return false;
//       }
//     }
//   };
// }
