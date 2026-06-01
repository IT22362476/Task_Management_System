import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="toast-container">
      <div
        *ngFor="let toast of toastService.toasts$ | async"
        class="toast"
        [ngClass]="toast.type"
        (click)="toastService.dismiss(toast.id)"
      >
        <span class="toast-icon">
          <ng-container [ngSwitch]="toast.type">
            <span *ngSwitchCase="'success'">✓</span>
            <span *ngSwitchCase="'error'">✕</span>
            <span *ngSwitchCase="'warning'">⚠</span>
            <span *ngSwitchCase="'info'">ℹ</span>
          </ng-container>
        </span>
        <span class="toast-message">{{ toast.message }}</span>
      </div>
    </div>
  `,
  styles: [`
    .toast-container {
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 10000;
      display: flex;
      flex-direction: column;
      gap: 8px;
      max-width: 400px;
    }
    .toast {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 14px 18px;
      border-radius: 10px;
      color: white;
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
      box-shadow: 0 8px 24px rgba(0,0,0,0.15);
      animation: slideIn 0.3s ease;
    }
    @keyframes slideIn {
      from { transform: translateX(100%); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
    .toast.success { background: #10b981; }
    .toast.error { background: #ef4444; }
    .toast.warning { background: #f59e0b; }
    .toast.info { background: #3b82f6; }
    .toast-icon { font-size: 16px; font-weight: 700; flex-shrink: 0; }
    .toast-message { flex: 1; }
  `]
})
export class ToastComponent {
  constructor(public toastService: ToastService) {}
}
