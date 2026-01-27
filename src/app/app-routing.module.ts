import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { MainLayoutComponent } from './core/layout/main-layout/main-layout.component';
import { AdminDashboardComponent as AdminDashboard } from './admin/admin-dashboard/admin-dashboard.component';
import { EmployeeDashboardComponent as EmployeeDashboard } from './employee/employee-dashboard/employee-dashboard.component';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },

  {
    path: '',
    component: MainLayoutComponent,
    children: [
      { path: 'admin/dashboard', component: AdminDashboard },
      { path: 'employee/dashboard', component: EmployeeDashboard }
    ]
  },

  { path: '**', redirectTo: 'login' }
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
