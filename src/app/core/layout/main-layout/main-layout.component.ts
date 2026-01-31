import { Component } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { HeaderComponent } from "../header/header.component";
import { CommonModule } from '@angular/common';
import { AdminSidebarComponent } from "../sidebar/admin-sidebar/admin-sidebar.component";
import { EmployeeSidebarComponent } from "../sidebar/employee-sidebar/employee-sidebar.component";

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [
    RouterOutlet,
    CommonModule,  
    HeaderComponent,
    AdminSidebarComponent,
    EmployeeSidebarComponent
],
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.scss']
})
export class MainLayoutComponent {
    role: 'admin' | 'employee' = 'employee';
}