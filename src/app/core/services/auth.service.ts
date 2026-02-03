import { Injectable } from '@angular/core';

export type UserRole = 'Admin' | 'Employee';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly ACCESS_TOKEN_KEY = 'access_token';
  private readonly REFRESH_TOKEN_KEY = 'refresh_token';

  // 🔐 Store tokens after login
  storeTokens(accessToken: string, refreshToken: string) {
    localStorage.setItem(this.ACCESS_TOKEN_KEY, accessToken);
    localStorage.setItem(this.REFRESH_TOKEN_KEY, refreshToken);
  }

  // 🔓 Logout
  logout() {
    localStorage.removeItem(this.ACCESS_TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
  }

  // 📥 Get access token
  getAccessToken(): string | null {
    return localStorage.getItem(this.ACCESS_TOKEN_KEY);
  }

  // 📥 Get refresh token
  getRefreshToken(): string | null {
    return localStorage.getItem(this.REFRESH_TOKEN_KEY);
  }

  // ✅ Logged-in check
  isLoggedIn(): boolean {
    return !!this.getAccessToken();
  }

  // 🧠 Extract role from JWT
  getUserRoleFromToken(): UserRole | null {
    const token = this.getAccessToken();
    if (!token) return null;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));

      // ✅ Microsoft role claim
      return payload[
        'http://schemas.microsoft.com/ws/2008/06/identity/claims/role'
      ] as UserRole ?? null;

    } catch {
      return null;
    }
  }


  // 🛡 Role helpers
  isAdmin(): boolean {
    return this.getUserRoleFromToken() === 'Admin';
  }

  isEmployee(): boolean {
    return this.getUserRoleFromToken() === 'Employee';
  }
}
