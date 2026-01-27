import { Component } from '@angular/core';
import { StatCardComponent } from "src/app/shared/components/stat-card/stat-card.component";
import { ActivityItemComponent } from "src/app/shared/activity-item/activity-item.component";

@Component({
  selector: 'app-employee-dashboard',
  templateUrl: './employee-dashboard.component.html',
  styleUrls: ['./employee-dashboard.component.scss'],
  standalone: true,
  imports: [StatCardComponent, ActivityItemComponent]
})
export class EmployeeDashboardComponent {

}
