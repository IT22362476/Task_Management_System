import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { ToastService } from '../../core/services/toast.service';
import { API, projectMembersUrl } from '../../core/api/api.config';
import { ApiResponse } from '../../core/models/api.models';
import { ProjectDetail, ProjectMember } from '../../core/models/project.models';
import { UserBrief } from '../../core/models/user.models';

@Component({
  selector: 'app-project-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './project-detail.component.html',
  styleUrls: ['./project-detail.component.scss']
})
export class ProjectDetailComponent implements OnInit {
  private api = inject(ApiService);
  private toast = inject(ToastService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  projectId = '';
  project?: ProjectDetail;
  members: ProjectMember[] = [];
  availableUsers: UserBrief[] = [];
  selectedUserId = '';
  isLoading = true;

  // Computed stats from the tasks array
  totalTasks = 0;
  completedTasks = 0;
  progressPercent = 0;
  newStatus = '';

  ngOnInit() {
    this.projectId = this.route.snapshot.paramMap.get('id') ?? '';
    if (!this.projectId) {
      this.toast.error('Project not found');
      this.router.navigate(['/admin/projects']);
      return;
    }
    this.loadProject();
  }

  loadProject() {
    this.isLoading = true;
    this.api.get<ApiResponse<ProjectDetail>>(`${API.PROJECTS}/${this.projectId}`).subscribe({
      next: (res) => {
        this.project = res.data;
        this.members = res.data?.members ?? [];

        // Compute stats from the tasks array in the response
        const tasks = res.data?.tasks ?? [];
        this.totalTasks = tasks.length;
        this.completedTasks = tasks.filter(t => t.status === 'completed').length;
        this.progressPercent = this.totalTasks > 0
          ? Math.round((this.completedTasks / this.totalTasks) * 100)
          : 0;

        this.loadAvailableUsers();
        this.isLoading = false;
      },
      error: () => {
        this.toast.error('Failed to load project');
        this.router.navigate(['/admin/projects']);
      }
    });
  }

  loadAvailableUsers() {
    this.api.get<ApiResponse<UserBrief[]>>(API.USERS).subscribe({
      next: (res) => {
        const allUsers = res.data ?? [];
        const memberIds = new Set(this.members.map(m => m.userId));
        this.availableUsers = allUsers.filter(u => !memberIds.has(u.id));
      },
      error: () => {}
    });
  }

  addMember() {
    if (!this.selectedUserId) { this.toast.warning('Select a user to add'); return; }
    this.api.post<ApiResponse<any>>(projectMembersUrl(this.projectId), {
      userId: this.selectedUserId, role: 'member'
    }).subscribe({
      next: () => {
        this.toast.success('Member added');
        this.selectedUserId = '';
        this.loadProject();
      },
      error: () => this.toast.error('Failed to add member')
    });
  }

  removeMember(userId: string, name: string) {
    if (!confirm(`Remove ${name} from project?`)) return;
    this.api.delete<ApiResponse<any>>(`${projectMembersUrl(this.projectId)}/${userId}`).subscribe({
      next: () => {
        this.toast.success('Member removed');
        this.loadProject();
      },
      error: () => this.toast.error('Failed to remove member')
    });
  }

  changeStatus() {
    if (!this.newStatus) return;
    this.api.put<ApiResponse<any>>(`${API.PROJECTS}/${this.projectId}`, { status: this.newStatus }).subscribe({
      next: () => {
        this.toast.success(`Project status changed to ${this.newStatus}`);
        if (this.project) this.project.status = this.newStatus;
        this.newStatus = '';
      },
      error: () => this.toast.error('Failed to update status')
    });
  }
}
