import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  {
    path: 'login',
    loadComponent: () =>
      import('./auth/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./auth/register/register.component').then(m => m.RegisterComponent)
  },

  {
    path: '',
    loadComponent: () =>
      import('./core/layout/main-layout/main-layout.component').then(m => m.MainLayoutComponent),
    canActivate: [authGuard],
    children: [
      { path: 'admin/dashboard', canActivate: [authGuard], data: { role: 'Admin' },
        loadComponent: () => import('./admin/admin-dashboard/admin-dashboard.component').then(m => m.AdminDashboardComponent) },
      { path: 'admin/projects', canActivate: [authGuard], data: { role: 'Admin' },
        loadComponent: () => import('./admin/projects/projects.component').then(m => m.ProjectsComponent) },
      { path: 'admin/projects/create', canActivate: [authGuard], data: { role: 'Admin' },
        loadComponent: () => import('./admin/project-create/project-create.component').then(m => m.ProjectCreateComponent) },
      { path: 'admin/projects/:id', canActivate: [authGuard], data: { role: 'Admin' },
        loadComponent: () => import('./admin/project-detail/project-detail.component').then(m => m.ProjectDetailComponent) },
      { path: 'admin/tasks', canActivate: [authGuard], data: { role: 'Admin' },
        loadComponent: () => import('./admin/tasks/tasks.component').then(m => m.TasksComponent) },
      { path: 'admin/tasks/create', canActivate: [authGuard], data: { role: 'Admin' },
        loadComponent: () => import('./admin/task-create/task-create.component').then(m => m.TaskCreateComponent) },
      { path: 'admin/tasks/:id', canActivate: [authGuard], data: { role: 'Admin' },
        loadComponent: () => import('./admin/task-detail/task-detail.component').then(m => m.TaskDetailComponent) },
      { path: 'admin/tasks/edit/:id', canActivate: [authGuard], data: { role: 'Admin' },
        loadComponent: () => import('./admin/task-edit/task-edit.component').then(m => m.TaskEditComponent) },
      { path: 'admin/team', canActivate: [authGuard], data: { role: 'Admin' },
        loadComponent: () => import('./admin/team/team.component').then(m => m.TeamComponent) },
      { path: 'admin/reports', canActivate: [authGuard], data: { role: 'Admin' },
        loadComponent: () => import('./admin/reports/reports.component').then(m => m.ReportsComponent) },
      { path: 'employee/dashboard', canActivate: [authGuard], data: { role: 'Employee' },
        loadComponent: () => import('./employee/employee-dashboard/employee-dashboard.component').then(m => m.EmployeeDashboardComponent) },
      { path: 'employee/my-tasks', canActivate: [authGuard], data: { role: 'Employee' },
        loadComponent: () => import('./employee/my-tasks/my-tasks.component').then(m => m.MyTasksComponent) },
      { path: 'employee/profile', canActivate: [authGuard], data: { role: 'Employee' },
        loadComponent: () => import('./employee/profile/profile.component').then(m => m.ProfileComponent) },
    ]
  },
  { path: '**', redirectTo: 'login' }
];
