import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  constructor(
    private auth: AuthService,
    private router: Router
  ) { }

  loginAsAdmin() {
    this.auth.login('admin');
    this.router.navigate(['/admin/dashboard']);
  }

  loginAsEmployee() {
    this.auth.login('employee');
    this.router.navigate(['/employee/dashboard']);
  }
}