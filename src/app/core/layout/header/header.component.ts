import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { SocialAuthService } from '@abacritt/angularx-social-login';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  userName = '';
  userRole = '';
  searchQuery = '';

  private auth = inject(AuthService);
  private router = inject(Router);
  private socialAuth? = inject(SocialAuthService, { optional: true });

  ngOnInit() {
    const user = this.auth.getUser();
    if (user) {
      this.userName = user.fullName;
      this.userRole = user.role;
    }
  }

  async logout() {
    // Sign out from Google if user logged in via Google
    try {
      await this.socialAuth?.signOut();
    } catch {
      // Google sign-out failed silently — app logout still proceeds
    }

    // Sign out from the app
    this.auth.logout();
    this.router.navigate(['/login']);
  }

  onSearch() {
    const route = this.auth.isAdmin() ? '/admin/tasks' : '/employee/my-tasks';
    this.router.navigate([route], {
      queryParams: { search: this.searchQuery }
    });
  }
}
