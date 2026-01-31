import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { MainLayoutComponent } from './core/layout/main-layout/main-layout.component';
import { AdminDashboardComponent as AdminDashboard } from './admin/admin-dashboard/admin-dashboard.component';
import { EmployeeDashboardComponent as EmployeeDashboard } from './employee/employee-dashboard/employee-dashboard.component';
import { ProjectsComponent } from './admin/projects/projects.component';
import { TasksComponent } from './admin/tasks/tasks.component';
import { TeamComponent } from './admin/team/team.component';
import { MyTasksComponent } from './employee/my-tasks/my-tasks.component';
import { ProfileComponent } from './employee/profile/profile.component';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },

  {
    path: '',
    component: MainLayoutComponent,
    children: [
      // Admin routes
      { path: 'admin/dashboard', component: AdminDashboard },
      { path: 'admin/projects', component: ProjectsComponent },
      { path: 'admin/tasks', component: TasksComponent },
      { path: 'admin/team', component: TeamComponent },

      // Employee routes
      { path: 'employee/dashboard', component: EmployeeDashboard },
      { path: 'employee/my-tasks', component: MyTasksComponent },
      { path: 'employee/profile', component: ProfileComponent },
    ]
  },

  { path: '**', redirectTo: 'login' }
];



@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
