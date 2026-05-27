import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { ToastService } from '../../core/services/toast.service';
import { API } from '../../core/api/api.config';
import { ApiResponse } from '../../core/models/api.models';
import { TaskDetail, TaskSummary, UpdateTaskRequest } from '../../core/models/task.models';
import { TASK_STATUSES, getTaskStatusLabel } from '../../core/models/status.config';

interface MemberOption { id: string; name: string; }

@Component({
  selector: 'app-task-edit',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './task-edit.component.html',
  styleUrls: ['./task-edit.component.scss']
})
export class TaskEditComponent implements OnInit {
  private api = inject(ApiService);
  private toast = inject(ToastService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  taskId = '';
  task?: TaskDetail;
  statuses = TASK_STATUSES;
  projectMembers: MemberOption[] = [];

  form: UpdateTaskRequest = {
    title: '',
    description: '',
    status: 'todo',
    priority: 'medium',
    assigneeId: '',
    dueDate: undefined,
    labels: []
  };
  labelsInput = '';
  isSubmitting = false;
  isLoading = true;

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
        if (this.task) {
          this.form = {
            title: this.task.title,
            description: this.task.description,
            status: this.task.status,
            priority: this.task.priority,
            assigneeId: this.task.assigneeId ?? '',
            dueDate: this.task.dueDate,
            labels: this.task.labels.map(l => l.name)
          };
          this.labelsInput = this.task.labels.map(l => l.name).join(', ');
          this.loadProjectMembers(this.task.projectId);
        }
        this.isLoading = false;
      },
      error: () => {
        this.toast.error('Failed to load task');
        this.router.navigate(['/admin/tasks']);
      }
    });
  }

  loadProjectMembers(projectId: string) {
    this.api.get<ApiResponse<any>>(`${API.PROJECTS}/${projectId}`).subscribe({
      next: (res) => {
        const members = (res.data as any)?.members ?? [];
        this.projectMembers = members.map((m: any) => ({ id: m.userId, name: m.name }));
      },
      error: () => { this.projectMembers = []; }
    });
  }

  submit() {
    if (!this.form.title?.trim()) {
      this.toast.warning('Task title is required');
      return;
    }

    this.form.labels = this.labelsInput
      .split(',')
      .map(s => s.trim())
      .filter(s => s.length > 0);

    if (!this.form.assigneeId) this.form.assigneeId = undefined;
    if (!this.form.dueDate) this.form.dueDate = undefined;

    this.isSubmitting = true;
    this.api.put<ApiResponse<TaskSummary>>(`${API.TASKS}/${this.taskId}`, this.form).subscribe({
      next: (res) => {
        this.toast.success(res.message || 'Task updated');
        this.router.navigate(['/admin/tasks']);
      },
      error: (err) => {
        this.toast.error(err.error?.message || 'Failed to update task');
        this.isSubmitting = false;
      }
    });
  }

  getStatusLabel(value: string): string {
    return getTaskStatusLabel(value);
  }
}
