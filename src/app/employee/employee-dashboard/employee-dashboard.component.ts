import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatCardComponent } from "src/app/shared/components/stat-card/stat-card.component";
import { ActivityItemComponent } from "src/app/shared/activity-item/activity-item.component";

@Component({
  selector: 'app-employee-dashboard',
  templateUrl: './employee-dashboard.component.html',
  styleUrls: ['./employee-dashboard.component.scss'],
  standalone: true,
  imports: [CommonModule, StatCardComponent, ActivityItemComponent]
})
export class EmployeeDashboardComponent {

}
