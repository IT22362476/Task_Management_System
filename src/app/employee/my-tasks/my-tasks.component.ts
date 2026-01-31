import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-my-tasks',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './my-tasks.component.html',
  styleUrls: ['./my-tasks.component.scss']
})
export class MyTasksComponent {
  projectsCount = 1;

  projects = ['Website Redesign'];

  stats = {
    total: 3,
    todo: 2,
    inProgress: 0,
    review: 0,
    completed: 1
  };

  tasks = [
    {
      title: 'Design homepage mockup',
      description:
        'Create high-fidelity mockup for the new homepage design including hero section and features',
      project: 'Website Redesign',
      dueDate: '2025-01-24',
      priority: 'high',
      status: 'completed',
      statusLabel: 'Completed',
      tags: ['design', 'ui/ux']
    },
    {
      title: 'User testing sessions',
      description:
        'Conduct user testing sessions with 15 participants to gather feedback',
      project: 'Website Redesign',
      dueDate: '2025-02-02',
      priority: 'medium',
      status: 'todo',
      statusLabel: 'Todo',
      tags: ['testing', 'ux']
    },
    {
      title: 'Mobile responsive testing',
      description:
        'Test and fix responsive design issues across multiple devices',
      project: 'Website Redesign',
      dueDate: '2025-02-08',
      priority: 'medium',
      status: 'todo',
      statusLabel: 'Todo',
      tags: ['testing', 'mobile']
    }
  ];

}
