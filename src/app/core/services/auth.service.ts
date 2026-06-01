import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { UserRole } from '../models/auth.models';

export interface AuthState {
  isAuthenticated: boolean;
  role: UserRole | null;
  accessToken: string | null;
  refreshToken: string | null;
  user: UserDetails | null;
}

export interface UserDetails {
  id: string;
  fullName: string;
  email: string;
  role: UserRole;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly ACCESS_TOKEN_KEY = 'access_token';
  private readonly REFRESH_TOKEN_KEY = 'refresh_token';
  private readonly USER_KEY = 'user_details';

  private authState = new BehaviorSubject<AuthState>(this.loadInitialState());

  readonly authState$: Observable<AuthState> = this.authState.asObservable();

  getUser(): UserDetails | null {
    return this.authState.value.user;
  }

  getUserName(): string {
    return this.authState.value.user?.fullName ?? 'User';
  }

  getUserEmail(): string {
    return this.authState.value.user?.email ?? '';
  }

  private loadInitialState(): AuthState {
    const accessToken = localStorage.getItem(this.ACCESS_TOKEN_KEY);
    const refreshToken = localStorage.getItem(this.REFRESH_TOKEN_KEY);
    const role = this.extractRole(accessToken);
    const user = this.loadUserFromStorage();

    return {
      isAuthenticated: !!accessToken,
      role,
      accessToken,
      refreshToken,
      user
    };
  }

  storeTokens(accessToken: string, refreshToken: string) {
    localStorage.setItem(this.ACCESS_TOKEN_KEY, accessToken);
    localStorage.setItem(this.REFRESH_TOKEN_KEY, refreshToken);

    const role = this.extractRole(accessToken);
    const user = this.extractUserDetails(accessToken);

    if (user) {
      localStorage.setItem(this.USER_KEY, JSON.stringify(user));
    }

    this.authState.next({
      isAuthenticated: true,
      role,
      accessToken,
      refreshToken,
      user
    });
  }

  logout() {
    localStorage.removeItem(this.ACCESS_TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);

    this.authState.next({
      isAuthenticated: false,
      role: null,
      accessToken: null,
      refreshToken: null,
      user: null
    });
  }

  getAccessToken(): string | null {
    return this.authState.value.accessToken;
  }

  getRefreshToken(): string | null {
    return this.authState.value.refreshToken;
  }

  isLoggedIn(): boolean {
    return this.authState.value.isAuthenticated;
  }

  getUserRole(): UserRole | null {
    return this.authState.value.role;
  }

  isAdmin(): boolean {
    return this.getUserRole() === 'Admin';
  }

  isEmployee(): boolean {
    return this.getUserRole() === 'Employee';
  }

  private extractRole(token: string | null): UserRole | null {
    if (!token) return null;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return (payload[
        'http://schemas.microsoft.com/ws/2008/06/identity/claims/role'
      ] as UserRole) ?? null;
    } catch {
      return null;
    }
  }

  private extractUserDetails(token: string): UserDetails | null {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return {
        id: payload['sub'] ?? '',
        fullName: payload['fullName'] ?? payload['email'] ?? 'User',
        email: payload['email'] ?? '',
        role: (payload[
          'http://schemas.microsoft.com/ws/2008/06/identity/claims/role'
        ] as UserRole) ?? 'Employee'
      };
    } catch {
      return null;
    }
  }

  private loadUserFromStorage(): UserDetails | null {
    try {
      const stored = localStorage.getItem(this.USER_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  }
}
