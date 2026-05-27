import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { AuthService } from '../../core/services/auth.service';
import { ToastService } from '../../core/services/toast.service';
import { GoogleSigninButtonModule, SocialAuthService } from '@abacritt/angularx-social-login';

import { API } from '../../core/api/api.config';
import { ApiService } from '../../core/services/api.service';
import { Subscription } from 'rxjs';
import { ApiResponse } from '../../core/models/api.models';
import { TokenResponse } from '../../core/models/auth.models';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  imports: [CommonModule, FormsModule, RouterLink, GoogleSigninButtonModule]
})
export class LoginComponent implements OnInit, OnDestroy {
  email = '';
  password = '';
  isLoading = false;

  private authService = inject(AuthService);
  private api = inject(ApiService);
  private router = inject(Router);
  private toast = inject(ToastService);
  private socialAuth? = inject(SocialAuthService, { optional: true });

  private authSub?: Subscription;

  ngOnInit() {
    this.authSub = this.socialAuth?.authState.subscribe({
      next: (user) => {
        if (user) {
          this.handleGoogleAuth(user);
        }
      },
      error: () => {
        this.toast.error('Google sign-in service unavailable');
      }
    });
  }

  ngOnDestroy() {
    this.authSub?.unsubscribe();
  }

  login() {
    if (this.isLoading) return;
    this.isLoading = true;

    this.api.post<ApiResponse<TokenResponse>>(API.AUTH.LOGIN, {
      email: this.email,
      password: this.password
    }).subscribe({
      next: (res) => {
        const data = res.data!;
        this.authService.storeTokens(data.accessToken, data.refreshToken);
        this.redirectBasedOnRole(this.authService.getUserRole());
      },
      error: () => {
        this.toast.error('Invalid email or password');
        this.isLoading = false;
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  private handleGoogleAuth(user: any) {
    this.api.post<ApiResponse<TokenResponse>>(API.AUTH.GOOGLE, { idToken: user.idToken })
      .subscribe({
        next: (res) => {
          const data = res.data!;
          this.authService.storeTokens(data.accessToken, data.refreshToken);
          this.redirectBasedOnRole(this.authService.getUserRole());
        },
        error: () => {
          this.toast.error('Google authentication failed');
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
