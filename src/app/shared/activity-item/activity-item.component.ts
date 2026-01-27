import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-activity-item',
  templateUrl: './activity-item.component.html',
  styleUrls: ['./activity-item.component.scss'],
  standalone: true,
  imports: [
    CommonModule
  ]
})
export class ActivityItemComponent {
  @Input() title!: string;
  @Input() subtitle!: string;
  @Input() time!: string;
  @Input() icon: 'check' | 'edit' | 'comment' = 'check';
}
