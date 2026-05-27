import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { ToastService } from '../../core/services/toast.service';
import { API } from '../../core/api/api.config';
import { ApiResponse } from '../../core/models/api.models';
import { TaskSummary, UpdateTaskRequest } from '../../core/models/task.models';
import { ProjectSummary } from '../../core/models/project.models';
import { TASK_STATUSES, getTaskStatusLabel } from '../../core/models/status.config';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink]
})
export class TasksComponent implements OnInit {
  private api = inject(ApiService);
  private toast = inject(ToastService);
  private router = inject(Router);

  tasks: TaskSummary[] = [];
  projects: ProjectSummary[] = [];
  selectedProject = 'all';
  selectedStatus = 'all';
  searchQuery = '';

  stats = { total: 0, todo: 0, inProgress: 0, review: 0, completed: 0 };
  isLoading = true;
  statuses = TASK_STATUSES;

  ngOnInit() {
    this.loadProjects();
    this.loadTasks();
  }

  loadProjects() {
    this.api.get<ApiResponse<ProjectSummary[]>>(API.PROJECTS).subscribe({
      next: (res) => { this.projects = res.data ?? []; },
      error: () => {}
    });
  }

  allTasks: TaskSummary[] = [];

  loadTasks() {
    this.isLoading = true;

    // Stats API — gets project-filtered tasks if project selected, but NO status filter
    // (stats always show breakdown across all statuses for the selected project)
    const statsParams: Record<string, string> = {};
    if (this.selectedProject !== 'all') statsParams['projectId'] = this.selectedProject;

    this.api.get<ApiResponse<TaskSummary[]>>(API.TASKS, statsParams).subscribe({
      next: (resAll) => {
        this.allTasks = resAll.data ?? [];
        this.updateStatsFromAll();
      },
      error: () => {}
    });

    // List API — includes both project AND status filter for the task cards below
    const listParams: Record<string, string> = {};
    if (this.selectedProject !== 'all') listParams['projectId'] = this.selectedProject;
    if (this.selectedStatus !== 'all') listParams['status'] = this.selectedStatus;

    this.api.get<ApiResponse<TaskSummary[]>>(API.TASKS, listParams).subscribe({
      next: (res) => {
        this.tasks = res.data ?? [];
        this.isLoading = false;
      },
      error: () => {
        this.toast.error('Failed to load tasks');
        this.isLoading = false;
      }
    });
  }

  filterByStatus(status: string) {
    this.selectedStatus = status;
    this.loadTasks();
  }

  onProjectChange() {
    this.loadTasks();
  }

  filteredTasks(): TaskSummary[] {
    let list = this.tasks;
    if (this.searchQuery) {
      const q = this.searchQuery.toLowerCase();
      list = list.filter(t =>
        t.title.toLowerCase().includes(q) ||
        (t.description && t.description.toLowerCase().includes(q)) ||
        (t.assigneeName && t.assigneeName.toLowerCase().includes(q))
      );
    }
    return list;
  }

  goToDetail(taskId: string) {
    this.router.navigate(['/admin/tasks', taskId]);
  }

  goToCreate() {
    this.router.navigate(['/admin/tasks/create']);
  }

  goToEdit(taskId: string) {
    this.router.navigate(['/admin/tasks/edit', taskId]);
  }

  updateStatus(taskId: string, event: Event) {
    const newStatus = (event.target as HTMLSelectElement).value;
    this.api.put<ApiResponse<TaskSummary>>(`${API.TASKS}/${taskId}`, { status: newStatus } as UpdateTaskRequest)
      .subscribe({
        next: () => {
          this.toast.success(`Task moved to ${newStatus}`);
          this.loadTasks();
        },
        error: () => { this.toast.error('Failed to update task'); }
      });
  }

  deleteTask(taskId: string) {
    if (!confirm('Delete this task?')) return;
    this.api.delete<ApiResponse<any>>(`${API.TASKS}/${taskId}`).subscribe({
      next: () => {
        this.toast.success('Task deleted');
        this.loadTasks();
      },
      error: () => { this.toast.error('Failed to delete task'); }
    });
  }

  getStatusLabel(value: string): string {
    return getTaskStatusLabel(value);
  }

  statForStatus(status: string): number {
    const map: Record<string, keyof typeof this.stats> = {
      'todo': 'todo', 'in-progress': 'inProgress', 'review': 'review', 'completed': 'completed'
    };
    return this.stats[map[status] || 'total'];
  }

  priorityClass(p: string): string {
    return p === 'high' ? 'priority-high' : p === 'medium' ? 'priority-medium' : 'priority-low';
  }

  private updateStatsFromAll() {
    this.stats = {
      total: this.allTasks.length,
      todo: this.allTasks.filter(t => t.status === 'todo').length,
      inProgress: this.allTasks.filter(t => t.status === 'in-progress').length,
      review: this.allTasks.filter(t => t.status === 'review').length,
      completed: this.allTasks.filter(t => t.status === 'completed').length
    };
  }
}
