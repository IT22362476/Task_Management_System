import { Component, OnInit, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-employee-sidebar',
  templateUrl: './employee-sidebar.component.html',
  styleUrls: ['./employee-sidebar.component.scss'],
  standalone: true,
  imports: [RouterModule],
})
export class EmployeeSidebarComponent implements OnInit {
  private auth = inject(AuthService);

  userName = '';
  userRole = '';
  userInitial = '?';

  ngOnInit() {
    const user = this.auth.getUser();
    if (user) {
      this.userName = user.fullName;
      this.userRole = user.role;
      this.userInitial = user.fullName.charAt(0).toUpperCase();
    }
  }
}
