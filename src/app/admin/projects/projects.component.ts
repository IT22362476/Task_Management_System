import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss']
})
export class ProjectsComponent {
  
projects = [
  {
    name: 'Website Redesign',
    status: 'In Progress',
    description: 'Complete overhaul of company website with modern UI/UX.',
    owner: 'Sarah Johnson',
    ownerAvatar: 'https://i.pravatar.cc/100?img=1',
    progress: 75,
    members: 8,
    completedTasks: 34,
    totalTasks: 45
  },
  {
    name: 'Mobile App Development',
    status: 'In Progress',
    description: 'Native iOS and Android application for customers.',
    owner: 'Michael Chen',
    ownerAvatar: 'https://i.pravatar.cc/100?img=2',
    progress: 45,
    members: 12,
    completedTasks: 31,
    totalTasks: 68
  },
  {
    name: 'Customer Portal Enhancement',
    status: 'Completed',
    description: 'Improving customer self-service experience.',
    owner: 'Lisa Anderson',
    ownerAvatar: 'https://i.pravatar.cc/100?img=3',
    progress: 100,
    members: 7,
    completedTasks: 41,
    totalTasks: 41
  }
];

}
