// login.component.ts
import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { AuthService } from '../../core/services/auth.service';
import {
  SocialAuthService,
  GoogleSigninButtonModule
} from '@abacritt/angularx-social-login';

import { API } from '../../core/api/api.config';
import { ApiService } from '../../core/services/api.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    GoogleSigninButtonModule
  ]
})
export class LoginComponent implements OnInit, OnDestroy {
  email = '';
  password = '';
  isLoading = false;
  googleLoading = false;

  private authService = inject(AuthService);
  private api = inject(ApiService);
  private router = inject(Router);
  private socialAuth = inject(SocialAuthService);

  private authSub?: Subscription;

  ngOnInit() {
    this.authSub = this.socialAuth.authState.subscribe({
      next: (user) => {
        if (user) {
          this.handleGoogleAuth(user);
        }
      },
      error: (err) => {
        console.error('Social auth error:', err);
        this.googleLoading = false;
      }
    });
  }

  ngOnDestroy() {
    this.authSub?.unsubscribe();
  }

  login() {
    if (this.isLoading) return;

    this.isLoading = true;

    this.api.post<any>(API.AUTH.LOGIN, {
      email: this.email,
      password: this.password
    }).subscribe({
      next: (res) => {
        this.authService.storeTokens(
          res.accessToken,
          res.refreshToken
        );

        const role = this.authService.getUserRoleFromToken();
        console.log('User role:', role);
        this.redirectBasedOnRole(role);
      },
      error: () => {
        alert('Invalid email or password');
        this.isLoading = false;
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  private handleGoogleAuth(user: any) {
    this.googleLoading = true;

    this.api.post<any>(
      API.AUTH.GOOGLE,
      { idToken: user.idToken }
    ).subscribe({
      next: (res) => {
        this.authService.storeTokens(
          res.accessToken,
          res.refreshToken
        );

        const role = this.authService.getUserRoleFromToken();
        this.redirectBasedOnRole(role);
      },
      error: () => {
        alert('Google authentication failed');
        this.googleLoading = false;
      },
      complete: () => {
        this.googleLoading = false;
      }
    });
  }

  private redirectBasedOnRole(role: string | null) {
    if (role === 'Admin') {
      this.router.navigate(['/admin/dashboard']);
    } else {
      this.router.navigate(['/employee/dashboard']);
    }
  }
}
