import { Component } from '@angular/core';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.scss']
})
export class TasksComponent {

  projectsCount = 6;

  projects = [
    'Website Redesign',
    'Mobile App Development',
    'Marketing Campaign'
  ];

  stats = {
    total: 12,
    todo: 4,
    inProgress: 4,
    review: 3,
    completed: 1
  };

  tasks = [
    {
      title: 'Design homepage mockup',
      description: 'Create high-fidelity mockup for the new homepage design',
      project: 'Website Redesign',
      assignee: 'Sarah Johnson',
      dueDate: '2025-01-24',
      priority: 'high',
      status: 'completed',
      statusLabel: 'Completed',
      tags: ['design', 'ui/ux']
    },
    {
      title: 'Implement user authentication',
      description: 'Set up JWT authentication and session management',
      project: 'Mobile App Development',
      assignee: 'David Kim',
      dueDate: '2025-01-27',
      priority: 'high',
      status: 'in-progress',
      statusLabel: 'In Progress',
      tags: ['backend', 'security']
    },
    {
      title: 'Write API documentation',
      description: 'Complete API docs with endpoints and auth methods',
      project: 'Website Redesign',
      assignee: 'Michael Chen',
      dueDate: '2025-01-25',
      priority: 'medium',
      status: 'in-progress',
      statusLabel: 'In Progress',
      tags: ['documentation', 'api']
    }
  ];


}
