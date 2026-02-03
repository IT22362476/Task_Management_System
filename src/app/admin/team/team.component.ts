import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-team',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './team.component.html',
  styleUrls: ['./team.component.scss']
})
export class TeamComponent {
  stats = {
    total: 8,
    admins: 1,
    managers: 2,
    employees: 5
  };

  members = [
    {
      name: 'Sarah Johnson',
      email: 'sarah.johnson@company.com',
      role: 'Manager',
      department: 'Design',
      tasksAssigned: 12,
      tasksCompleted: 8,
      joinDate: 'Mar 2023',
      avatar: 'https://i.pravatar.cc/150?img=1'
    },
    {
      name: 'Michael Chen',
      email: 'michael.chen@company.com',
      role: 'Employee',
      department: 'Development',
      tasksAssigned: 15,
      tasksCompleted: 11,
      joinDate: 'Jan 2023',
      avatar: 'https://i.pravatar.cc/150?img=2'
    },
    {
      name: 'Emily Rodriguez',
      email: 'emily.rodriguez@company.com',
      role: 'Manager',
      department: 'Marketing',
      tasksAssigned: 10,
      tasksCompleted: 9,
      joinDate: 'Nov 2022',
      avatar: 'https://i.pravatar.cc/150?img=3'
    },
    {
      name: 'David Kim',
      email: 'david.kim@company.com',
      role: 'Employee',
      department: 'Development',
      tasksAssigned: 14,
      tasksCompleted: 10,
      joinDate: 'May 2023',
      avatar: 'https://i.pravatar.cc/150?img=4'
    }
  ];

}
