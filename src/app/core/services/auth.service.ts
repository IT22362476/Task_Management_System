import { Injectable } from '@angular/core';

export type UserRole = 'admin' | 'employee';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  login(role: UserRole) {
    localStorage.setItem('role', role);
  }

  logout() {
    localStorage.removeItem('role');
  }

  getRole(): UserRole | null {
    return localStorage.getItem('role') as UserRole | null;
  }

  isAdmin(): boolean {
    return this.getRole() === 'admin';
  }

  isEmployee(): boolean {
    return this.getRole() === 'employee';
  }

  isLoggedIn(): boolean {
    return !!this.getRole();
  }
}
