import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { ToastService } from '../../core/services/toast.service';
import { AuthService } from '../../core/services/auth.service';
import { StatCardComponent } from '../../shared/components/stat-card/stat-card.component';
import { ActivityItemComponent } from '../../shared/activity-item/activity-item.component';
import { API } from '../../core/api/api.config';
import { ApiResponse } from '../../core/models/api.models';
import { EmployeeDashboard } from '../../core/models/dashboard.models';

@Component({
  selector: 'app-employee-dashboard',
  templateUrl: './employee-dashboard.component.html',
  styleUrls: ['./employee-dashboard.component.scss'],
  standalone: true,
  imports: [CommonModule, StatCardComponent, ActivityItemComponent]
})
export class EmployeeDashboardComponent implements OnInit {
  private api = inject(ApiService);
  private toast = inject(ToastService);
  private router = inject(Router);
  private auth = inject(AuthService);

  userName = '';
  stats = { total: 0, todo: 0, inProgress: 0, review: 0, completed: 0 };
  completionRate = 0;
  circleOffset = 283;
  deadlines: Array<{ title: string; date: string; daysLeft: number }> = [];
  activities: Array<{ title: string; subtitle: string; time: string; icon: 'check' | 'edit' | 'comment' }> = [];
  isLoading = true;

  ngOnInit() {
    const token = this.auth.getAccessToken();
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        this.userName = payload['fullName'] || payload['email'] || 'Employee';
      } catch { /* ignore */ }
    }
    this.loadDashboard();
  }

  loadDashboard() {
    this.isLoading = true;
    this.api.get<ApiResponse<EmployeeDashboard>>(API.DASHBOARD.EMPLOYEE).subscribe({
      next: (res) => {
        const data = res.data!;
        this.stats = {
          total: data.taskStats.total,
          todo: data.taskStats.todo,
          inProgress: data.taskStats.inProgress,
          review: data.taskStats.review,
          completed: data.taskStats.completed
        };
        this.completionRate = data.completionRate;
        this.circleOffset = 283 * (1 - data.completionRate / 100);
        this.deadlines = data.upcomingDeadlines.map(d => ({
          title: d.title,
          date: d.dueDate ? new Date(d.dueDate).toLocaleDateString() : 'No date',
          daysLeft: d.daysRemaining
        }));
        this.activities = data.recentActivity.map(a => ({
          title: this.formatAction(a.action),
          subtitle: a.description || '',
          time: this.timeAgo(a.createdAt),
          icon: this.actionIcon(a.action)
        }));
        this.isLoading = false;
      },
      error: () => {
        this.toast.error('Failed to load dashboard');
        this.isLoading = false;
      }
    });
  }

  viewAllTasks() {
    this.router.navigate(['/employee/my-tasks']);
  }

  private formatAction(action: string): string {
    const map: Record<string, string> = {
      'task_created': 'Created task',
      'comment_added': 'Added comment',
      'task_updated': 'Updated task'
    };
    return map[action] || action;
  }

  private actionIcon(action: string): 'check' | 'edit' | 'comment' {
    if (action === 'task_created') return 'check';
    if (action === 'task_updated') return 'edit';
    return 'comment';
  }

  private timeAgo(dateStr: string): string {
    const now = Date.now();
    const date = new Date(dateStr).getTime();
    const diff = Math.floor((now - date) / 1000);
    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  }
}
