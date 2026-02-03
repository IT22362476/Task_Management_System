import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { ApiService } from '../../core/services/api.service';
import { AuthService } from '../../core/services/auth.service';
import { API } from '../../core/api/api.config';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule],
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

  constructor(
    private api: ApiService,
    private authService: AuthService,
    private router: Router
  ) {}

  register() {
    if (this.password !== this.confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    this.api.post<any>(API.AUTH.REGISTER, {
      fullName: this.fullName,
      email: this.email,
      password: this.password,
      role: this.role
    }).subscribe({
      next: (res) => {
        // Save JWT + refresh token
        this.authService.storeTokens(
          res.accessToken,
          res.refreshToken
        );

        // Redirect based on role
        const role = this.authService.getUserRoleFromToken();
        this.router.navigate(
          role === 'Admin'
            ? ['/admin/dashboard']
            : ['/employee/dashboard']
        );
      },
      error: (err) => {
        console.error('Registration failed', err);
        alert('Registration failed. Please try again.');
      }
    });
  }
}
