import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../core/services/api.service';
import { AuthService } from '../../core/services/auth.service';
import { API } from '../../core/api/api.config';
import { ApiResponse } from '../../core/models/api.models';
import { TaskSummary } from '../../core/models/task.models';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  private api = inject(ApiService);
  private auth = inject(AuthService);

  userName = '';
  userEmail = '';
  userRole = '';

  stats = { total: 0, completed: 0, inProgress: 0, overdue: 0 };
  activity: Array<{ type: string; text: string; time: string }> = [];
  deadlines: Array<{ title: string; project: string; date: string }> = [];

  ngOnInit() {
    const token = this.auth.getAccessToken();
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        this.userName = payload['fullName'] || 'User';
        this.userEmail = payload['email'] || '';
        this.userRole = payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] || '';
      } catch { /* ignore */ }
    }
    this.loadData();
  }

  loadData() {
    this.api.get<ApiResponse<TaskSummary[]>>(API.TASKS).subscribe({
      next: (res) => {
        const tasks = res.data ?? [];
        const now = new Date();
        this.stats = {
          total: tasks.length,
          completed: tasks.filter(t => t.status === 'completed').length,
          inProgress: tasks.filter(t => t.status === 'in-progress').length,
          overdue: tasks.filter(t => t.status !== 'completed' && t.dueDate && new Date(t.dueDate) < now).length
        };
        this.deadlines = tasks
          .filter(t => t.status !== 'completed' && t.dueDate)
          .slice(0, 5)
          .map(t => ({
            title: t.title,
            project: t.projectName,
            date: new Date(t.dueDate!).toLocaleDateString()
          }));
        this.activity = tasks.slice(0, 5).map(t => ({
          type: t.status === 'completed' ? 'green' : 'blue',
          text: `${t.status === 'completed' ? 'Completed' : 'Working on'}: ${t.title}`,
          time: new Date(t.createdAt).toLocaleDateString()
        }));
      },
      error: () => { /* silently fail */ }
    });
  }
}
