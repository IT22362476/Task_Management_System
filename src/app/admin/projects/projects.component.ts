import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { ToastService } from '../../core/services/toast.service';
import { API } from '../../core/api/api.config';
import { ApiResponse } from '../../core/models/api.models';
import { ProjectSummary } from '../../core/models/project.models';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss']
})
export class ProjectsComponent implements OnInit {
  private api = inject(ApiService);
  private toast = inject(ToastService);
  private router = inject(Router);

  projects: ProjectSummary[] = [];
  filteredProjects: ProjectSummary[] = [];
  activeFilter = 'all';
  isLoading = true;

  ngOnInit() {
    this.loadProjects();
  }

  loadProjects() {
    this.isLoading = true;
    this.api.get<ApiResponse<ProjectSummary[]>>(API.PROJECTS).subscribe({
      next: (res) => {
        this.projects = res.data ?? [];
        this.applyFilter();
        this.isLoading = false;
      },
      error: () => {
        this.toast.error('Failed to load projects');
        this.isLoading = false;
      }
    });
  }

  setFilter(filter: string) {
    this.activeFilter = filter;
    this.applyFilter();
  }

  applyFilter() {
    if (this.activeFilter === 'all') {
      this.filteredProjects = this.projects;
    } else {
      this.filteredProjects = this.projects.filter(p => p.status === this.activeFilter);
    }
  }

  deleteProject(id: string) {
    if (!confirm('Delete this project and all its tasks?')) return;
    this.api.delete<ApiResponse<any>>(`${API.PROJECTS}/${id}`).subscribe({
      next: () => {
        this.toast.success('Project deleted');
        this.loadProjects();
      },
      error: () => this.toast.error('Failed to delete project')
    });
  }

  getStatusClass(status: string): string {
    return status.toLowerCase().replace(' ', '-');
  }
}
