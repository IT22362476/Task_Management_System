import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatCardComponent } from "src/app/shared/components/stat-card/stat-card.component";
import { ProgressBarComponent } from "src/app/shared/progress-bar/progress-bar.component";

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss'],
  imports: [CommonModule, StatCardComponent, ProgressBarComponent]
})
export class AdminDashboardComponent {

  projects = [
    { id: 'p1', name: 'Website Redesign' },
    { id: 'p2', name: 'Mobile App Development' },
    { id: 'p3', name: 'Marketing Campaign' }
  ];

  stats = {
    total: 156,
    completed: 89,
    pending: 52,
    overdue: 15,
    todo: 35,
    inProgress: 42,
    review: 25
  };

  progress = [
    { name: 'Website Redesign', percent: 75 },
    { name: 'Mobile App Development', percent: 45 }
  ];

  onProjectChange(event: Event) {
    const projectId = (event.target as HTMLSelectElement).value;

    if (projectId === 'all') {
      this.loadAllProjects();
    } else {
      this.loadProject(projectId);
    }
  }

  loadAllProjects() {
    // mock overall stats
    this.stats = {
      total: 156,
      completed: 89,
      pending: 52,
      overdue: 15,
      todo: 35,
      inProgress: 42,
      review: 25
    };

    this.progress = [
      { name: 'Website Redesign', percent: 75 },
      { name: 'Mobile App Development', percent: 45 }
    ];
  }

  loadProject(projectId: string) {
    // mock project-specific stats
    this.stats = {
      total: 42,
      completed: 30,
      pending: 10,
      overdue: 2,
      todo: 8,
      inProgress: 14,
      review: 6
    };

    this.progress = [
      { name: 'Selected Project', percent: 60 }
    ];
  }
}
