import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  {
    path: 'login',
    loadComponent: () =>
      import('./auth/login/login.component')
        .then(m => m.LoginComponent)
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./auth/register/register.component')
        .then(m => m.RegisterComponent)
  },

  {
    path: '',
    loadComponent: () =>
      import('./core/layout/main-layout/main-layout.component')
        .then(m => m.MainLayoutComponent),
    children: [
      {
        path: 'admin/dashboard',
        loadComponent: () =>
          import('./admin/admin-dashboard/admin-dashboard.component')
            .then(m => m.AdminDashboardComponent)
      },
      {
        path: 'admin/projects',
        loadComponent: () =>
          import('./admin/projects/projects.component')
            .then(m => m.ProjectsComponent)
      },
      {
        path: 'admin/tasks',
        loadComponent: () =>
          import('./admin/tasks/tasks.component')
            .then(m => m.TasksComponent)
      },
      {
        path: 'admin/team',
        loadComponent: () =>
          import('./admin/team/team.component')
            .then(m => m.TeamComponent)
      },

      {
        path: 'employee/dashboard',
        loadComponent: () =>
          import('./employee/employee-dashboard/employee-dashboard.component')
            .then(m => m.EmployeeDashboardComponent)
      },
      {
        path: 'employee/my-tasks',
        loadComponent: () =>
          import('./employee/my-tasks/my-tasks.component')
            .then(m => m.MyTasksComponent)
      },
      {
        path: 'employee/profile',
        loadComponent: () =>
          import('./employee/profile/profile.component')
            .then(m => m.ProfileComponent)
      }
    ]
  },

  { path: '**', redirectTo: 'login' }
];
