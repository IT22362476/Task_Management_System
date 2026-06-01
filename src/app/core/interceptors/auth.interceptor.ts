import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { HttpClient } from '@angular/common/http';
import { catchError, switchMap, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';

let isRefreshing = false;

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const http = inject(HttpClient);
  const router = inject(Router);

  const accessToken = authService.getAccessToken();
  let authReq = req;

  if (accessToken) {
    authReq = req.clone({
      setHeaders: { Authorization: `Bearer ${accessToken}` }
    });
  }

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401 && !isRefreshing) {
        isRefreshing = true;

        const refreshToken = authService.getRefreshToken();
        if (!refreshToken) {
          authService.logout();
          router.navigate(['/login']);
          return throwError(() => error);
        }

        return http.post<any>(`${environment.apiUrl}/auth/refresh`, { refreshToken }).pipe(
          switchMap(res => {
            isRefreshing = false;
            const data = res.data ?? res;
            authService.storeTokens(data.accessToken, data.refreshToken);

            const retryReq = req.clone({
              setHeaders: { Authorization: `Bearer ${data.accessToken}` }
            });
            return next(retryReq);
          }),
          catchError(err => {
            isRefreshing = false;
            authService.logout();
            router.navigate(['/login']);
            return throwError(() => err);
          })
        );
      }

      return throwError(() => error);
    })
  );
};
