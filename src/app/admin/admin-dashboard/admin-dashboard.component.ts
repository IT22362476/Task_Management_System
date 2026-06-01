import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { ToastService } from '../../core/services/toast.service';
import { AuthService } from '../../core/services/auth.service';
import { StatCardComponent } from '../../shared/components/stat-card/stat-card.component';
import { ProgressBarComponent } from '../../shared/progress-bar/progress-bar.component';
import { API } from '../../core/api/api.config';
import { ApiResponse } from '../../core/models/api.models';
import { AdminDashboard, ProjectProgress } from '../../core/models/dashboard.models';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss'],
  imports: [CommonModule, StatCardComponent, ProgressBarComponent]
})
export class AdminDashboardComponent implements OnInit {
  private api = inject(ApiService);
  private toast = inject(ToastService);
  private router = inject(Router);
  private auth = inject(AuthService);

  userName = '';

  stats = { total: 0, todo: 0, inProgress: 0, review: 0, completed: 0, overdue: 0 };
  progress: ProjectProgress[] = [];
  activities: Array<{ text: string; time: string }> = [];
  deadlines: Array<{ title: string; date: string; urgent: boolean }> = [];

  isLoading = true;

  ngOnInit() {
    const token = this.auth.getAccessToken();
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        this.userName = payload['fullName'] || payload['email'] || 'Admin';
      } catch { /* ignore */ }
    }
    this.loadDashboard();
  }

  loadDashboard() {
    this.isLoading = true;
    this.api.get<ApiResponse<AdminDashboard>>(API.DASHBOARD.ADMIN).subscribe({
      next: (res) => {
        const data = res.data!;
        this.stats = {
          total: data.taskStats.total,
          todo: data.taskStats.todo,
          inProgress: data.taskStats.inProgress,
          review: data.taskStats.review,
          completed: data.taskStats.completed,
          overdue: data.taskStats.overdue
        };
        this.progress = data.projectProgress;
        this.activities = data.recentActivity.map(a => ({
          text: `${a.actorName} ${this.formatAction(a.action)}`,
          time: this.timeAgo(a.createdAt)
        }));
        this.deadlines = data.upcomingDeadlines.map(d => ({
          title: d.title,
          date: d.dueDate ? new Date(d.dueDate).toLocaleDateString() : 'No date',
          urgent: d.daysRemaining <= 2
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
    this.router.navigate(['/admin/tasks']);
  }

  private formatAction(action: string): string {
    const map: Record<string, string> = {
      'task_created': 'created a new task',
      'comment_added': 'commented on a task',
      'task_updated': 'updated a task'
    };
    return map[action] || action;
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
