import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { ToastService } from '../../core/services/toast.service';
import { API, projectMembersUrl } from '../../core/api/api.config';
import { ApiResponse } from '../../core/models/api.models';
import { TaskSummary, CreateTaskRequest } from '../../core/models/task.models';
import { ProjectSummary } from '../../core/models/project.models';
import { UserBrief } from '../../core/models/user.models';

@Component({
  selector: 'app-task-create',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './task-create.component.html',
  styleUrls: ['./task-create.component.scss']
})
export class TaskCreateComponent implements OnInit {
  private api = inject(ApiService);
  private toast = inject(ToastService);
  private router = inject(Router);

  projects: ProjectSummary[] = [];
  projectMembers: UserBrief[] = [];

  form: CreateTaskRequest = {
    title: '',
    description: '',
    priority: 'medium',
    projectId: '',
    assigneeId: '',
    dueDate: undefined,
    labels: []
  };
  labelsInput = '';
  isSubmitting = false;
  isLoading = false;

  ngOnInit() {
    this.loadProjects();
  }

  loadProjects() {
    this.isLoading = true;
    this.api.get<ApiResponse<ProjectSummary[]>>(API.PROJECTS).subscribe({
      next: (res) => {
        this.projects = res.data ?? [];
        if (this.projects.length > 0) {
          this.form.projectId = this.projects[0].id;
          this.loadMembers();
        }
        this.isLoading = false;
      },
      error: () => {
        this.toast.error('Failed to load projects');
        this.isLoading = false;
      }
    });
  }

  loadMembers() {
    if (!this.form.projectId) { this.projectMembers = []; return; }
    this.api.get<ApiResponse<any>>(`${API.PROJECTS}/${this.form.projectId}`).subscribe({
      next: (res) => {
        const members = (res.data as any)?.members ?? [];
        this.projectMembers = members.map((m: any) => ({
          id: m.userId, fullName: m.name, email: m.email, role: m.role
        }));
      },
      error: () => { this.projectMembers = []; }
    });
  }

  onProjectChange() {
    this.form.assigneeId = '';
    this.loadMembers();
  }

  submit() {
    if (!this.form.title.trim()) {
      this.toast.warning('Task title is required');
      return;
    }
    if (!this.form.projectId) {
      this.toast.warning('Please select a project');
      return;
    }

    this.form.labels = this.labelsInput
      .split(',')
      .map(s => s.trim())
      .filter(s => s.length > 0);

    this.isSubmitting = true;
    this.api.post<ApiResponse<TaskSummary>>(API.TASKS, this.form).subscribe({
      next: (res) => {
        this.toast.success(res.message || 'Task created');
        this.router.navigate(['/admin/tasks']);
      },
      error: (err) => {
        this.toast.error(err.error?.message || 'Failed to create task');
        this.isSubmitting = false;
      }
    });
  }
}
