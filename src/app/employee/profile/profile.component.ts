import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent {
  stats = {
    total: 3,
    completed: 1,
    inProgress: 0,
    overdue: 2
  };

  activity = [
    {
      type: 'green',
      text: 'Completed task: Design homepage mockup',
      time: '2 hours ago'
    },
    {
      type: 'blue',
      text: 'Updated task status to In Progress',
      time: '5 hours ago'
    },
    {
      type: 'yellow',
      text: 'Added comment on Mobile responsive testing',
      time: '1 day ago'
    },
    {
      type: 'gray',
      text: 'Assigned to new task: User testing sessions',
      time: '2 days ago'
    }
  ];

  deadlines = [
    {
      title: 'User testing sessions',
      project: 'Website Redesign',
      date: '2025-02-02'
    },
    {
      title: 'Mobile responsive testing',
      project: 'Website Redesign',
      date: '2025-02-08'
    }
  ];

}
