import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

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

  ngOnInit() {
    const token = this.auth.getAccessToken();
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        this.userName = payload['fullName'] || payload['email'] || 'User';
        this.userRole = this.auth.getUserRole() || '';
      } catch {
        this.userName = 'User';
      }
    }
  }

  logout() {
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
