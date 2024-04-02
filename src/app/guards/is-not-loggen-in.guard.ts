import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AppRoutes } from '@routes/app-routers';
import { SesionService } from '@services/sesion.service';

export const isNotLoggenInGuard: CanActivateFn = (route, state) => {
  const sesionService = inject(SesionService);
  const router = inject(Router);
  if (!sesionService.isLoggedIn)
    return true;
  return router.createUrlTree([`/${AppRoutes.dashboard.path}`]);
};
