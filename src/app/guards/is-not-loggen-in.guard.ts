import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AppRoutes } from '@routes/app-routers';
import { SessionService } from '@services/session.service';

export const isNotLoggenInGuard: CanActivateFn = (route, state) => {
  const sessionService = inject(SessionService);
  const router = inject(Router);
  if (!sessionService.isLoggedIn)
    return true;
  return router.createUrlTree([`/${AppRoutes.dashboard.path}`]);
};
