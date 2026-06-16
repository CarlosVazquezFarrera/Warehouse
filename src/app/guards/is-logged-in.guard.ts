import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AppRoutes } from '@routes/app-routers';
import { SessionService } from '@services/session.service';

export const isLoggedInGuard = (shouldBeLoggedIn: boolean, redirectRoute = AppRoutes.login
): CanActivateFn => (route, state) => {
  const sessionService = inject(SessionService);
  const router = inject(Router);
  const isLoggedIn = sessionService.isLoggedIn;

  const shouldAllow = shouldBeLoggedIn ? isLoggedIn : !isLoggedIn;
  if (shouldAllow) return true;

  const path = redirectRoute.startsWith('/') ? redirectRoute : `/${redirectRoute}`;
  return router.createUrlTree([path]);
};
