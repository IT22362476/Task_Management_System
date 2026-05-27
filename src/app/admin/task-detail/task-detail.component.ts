import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { ToastService } from '../../core/services/toast.service';
import { API } from '../../core/api/api.config';
import { ApiResponse } from '../../core/models/api.models';
import { TaskDetail, AddCommentRequest } from '../../core/models/task.models';
import { TASK_STATUSES, getTaskStatusLabel, getTaskStatusColor } from '../../core/models/status.config';

@Component({
  selector: 'app-task-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './task-detail.component.html',
  styleUrls: ['./task-detail.component.scss']
})
export class TaskDetailComponent implements OnInit {
  private api = inject(ApiService);
  private toast = inject(ToastService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  taskId = '';
  task?: TaskDetail;
  newComment = '';
  isLoading = true;
  statuses = TASK_STATUSES;

  ngOnInit() {
    this.taskId = this.route.snapshot.paramMap.get('id') ?? '';
    if (!this.taskId) {
      this.toast.error('Task not found');
      this.router.navigate(['/admin/tasks']);
      return;
    }
    this.loadTask();
  }

  loadTask() {
    this.isLoading = true;
    this.api.get<ApiResponse<TaskDetail>>(`${API.TASKS}/${this.taskId}`).subscribe({
      next: (res) => {
        this.task = res.data;
        this.isLoading = false;
      },
      error: () => {
        this.toast.error('Failed to load task');
        this.router.navigate(['/admin/tasks']);
      }
    });
  }

  addComment() {
    if (!this.newComment.trim() || !this.task) return;
    this.api.post<ApiResponse<any>>(`${API.TASKS}/${this.taskId}/comments`, { content: this.newComment } as AddCommentRequest)
      .subscribe({
        next: () => {
          this.newComment = '';
          this.loadTask();
          this.toast.success('Comment added');
        },
        error: () => { this.toast.error('Failed to add comment'); }
      });
  }

  deleteTask() {
    if (!confirm('Delete this task?')) return;
    this.api.delete<ApiResponse<any>>(`${API.TASKS}/${this.taskId}`).subscribe({
      next: () => {
        this.toast.success('Task deleted');
        this.router.navigate(['/admin/tasks']);
      },
      error: () => this.toast.error('Failed to delete task')
    });
  }

  getStatusLabel(value: string): string {
    return getTaskStatusLabel(value);
  }

  getStatusColor(value: string): string {
    return getTaskStatusColor(value);
  }

  priorityClass(p: string): string {
    return p === 'high' ? 'priority-high' : p === 'medium' ? 'priority-medium' : 'priority-low';
  }
}
