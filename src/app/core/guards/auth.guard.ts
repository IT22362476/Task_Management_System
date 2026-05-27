import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route): boolean | UrlTree => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (!auth.isLoggedIn()) {
    return router.createUrlTree(['/login']);
  }

  const expectedRole = route.data['role'] as string | undefined;
  if (expectedRole && auth.getUserRole() !== expectedRole) {
    const fallback = expectedRole === 'Admin' ? '/employee/dashboard' : '/admin/dashboard';
    return router.createUrlTree([fallback]);
  }

  return true;
};
