import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { ToastService } from '../../core/services/toast.service';
import { API } from '../../core/api/api.config';
import { ApiResponse } from '../../core/models/api.models';
import { ProjectSummary, CreateProjectRequest } from '../../core/models/project.models';

@Component({
  selector: 'app-project-create',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './project-create.component.html',
  styleUrls: ['./project-create.component.scss']
})
export class ProjectCreateComponent {
  private api = inject(ApiService);
  private toast = inject(ToastService);
  private router = inject(Router);

  form: CreateProjectRequest = { name: '', description: '' };
  isSubmitting = false;

  submit() {
    if (!this.form.name.trim()) {
      this.toast.warning('Project name is required');
      return;
    }

    this.isSubmitting = true;
    this.api.post<ApiResponse<ProjectSummary>>(API.PROJECTS, this.form).subscribe({
      next: (res) => {
        this.toast.success(res.message || 'Project created');
        this.router.navigate(['/admin/projects']);
      },
      error: (err) => {
        this.toast.error(err.error?.message || 'Failed to create project');
        this.isSubmitting = false;
      }
    });
  }
}
