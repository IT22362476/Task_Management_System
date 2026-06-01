import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { ApiService } from '../../core/services/api.service';
import { AuthService } from '../../core/services/auth.service';
import { ToastService } from '../../core/services/toast.service';
import { API } from '../../core/api/api.config';
import { ApiResponse } from '../../core/models/api.models';
import { TokenResponse } from '../../core/models/auth.models';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  fullName = '';
  email = '';
  role = '';
  password = '';
  confirmPassword = '';
  termsAccepted = false;

  private api = inject(ApiService);
  private authService = inject(AuthService);
  private router = inject(Router);
  private toast = inject(ToastService);

  register() {
    if (this.password !== this.confirmPassword) {
      this.toast.warning('Passwords do not match');
      return;
    }

    if (this.password.length < 8) {
      this.toast.warning('Password must be at least 8 characters');
      return;
    }

    this.api.post<ApiResponse<TokenResponse>>(API.AUTH.REGISTER, {
      fullName: this.fullName,
      email: this.email,
      password: this.password,
      role: this.role
    }).subscribe({
      next: (res) => {
        const data = res.data!;
        this.authService.storeTokens(data.accessToken, data.refreshToken);
        this.toast.success('Account created successfully');
        const role = this.authService.getUserRole();
        this.router.navigate(
          role === 'Admin' ? ['/admin/dashboard'] : ['/employee/dashboard']
        );
      },
      error: (err) => {
        const message = err.error?.message || 'Registration failed. Please try again.';
        this.toast.error(message);
      }
    });
  }
}
