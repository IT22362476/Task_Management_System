import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../core/services/api.service';
import { ToastService } from '../../core/services/toast.service';
import { AuthService } from '../../core/services/auth.service';
import { API } from '../../core/api/api.config';
import { ApiResponse } from '../../core/models/api.models';
import { TaskSummary, UpdateTaskRequest } from '../../core/models/task.models';
import { TASK_STATUSES, getTaskStatusLabel } from '../../core/models/status.config';

@Component({
  selector: 'app-my-tasks',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './my-tasks.component.html',
  styleUrls: ['./my-tasks.component.scss']
})
export class MyTasksComponent implements OnInit {
  private api = inject(ApiService);
  private toast = inject(ToastService);
  private auth = inject(AuthService);

  userId = '';
  tasks: TaskSummary[] = [];
  filteredTasksList: TaskSummary[] = [];
  selectedStatus = 'all';
  searchQuery = '';

  stats = { total: 0, todo: 0, inProgress: 0, review: 0, completed: 0 };
  isLoading = true;

  ngOnInit() {
    const token = this.auth.getAccessToken();
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        this.userId = payload['sub'] || '';
      } catch { /* ignore */ }
    }
    this.loadTasks();
  }

  loadTasks() {
    this.isLoading = true;
    this.api.get<ApiResponse<TaskSummary[]>>(API.TASKS).subscribe({
      next: (res) => {
        this.tasks = res.data ?? [];
        this.applyFilters();
        this.isLoading = false;
      },
      error: () => {
        this.toast.error('Failed to load tasks');
        this.isLoading = false;
      }
    });
  }

  applyFilters() {
    let list = this.tasks;
    if (this.selectedStatus !== 'all') {
      list = list.filter(t => t.status === this.selectedStatus);
    }
    if (this.searchQuery) {
      const q = this.searchQuery.toLowerCase();
      list = list.filter(t => t.title.toLowerCase().includes(q));
    }
    this.filteredTasksList = list;
    this.updateStats();
  }

  filterByStatus(status: string) {
    this.selectedStatus = status;
    this.applyFilters();
  }

  updateStatus(taskId: string, event: Event) {
    const newStatus = (event.target as HTMLSelectElement).value;
    this.api.put<ApiResponse<TaskSummary>>(`${API.TASKS}/${taskId}`, { status: newStatus } as UpdateTaskRequest)
      .subscribe({
        next: () => {
          this.toast.success(`Task moved to ${newStatus}`);
          this.loadTasks();
        },
        error: () => this.toast.error('Failed to update task')
      });
  }

  private updateStats() {
    this.stats = {
      total: this.tasks.length,
      todo: this.tasks.filter(t => t.status === 'todo').length,
      inProgress: this.tasks.filter(t => t.status === 'in-progress').length,
      review: this.tasks.filter(t => t.status === 'review').length,
      completed: this.tasks.filter(t => t.status === 'completed').length
    };
  }

  priorityClass(p: string): string {
    return p === 'high' ? 'priority-high' : p === 'medium' ? 'priority-medium' : 'priority-low';
  }
}
