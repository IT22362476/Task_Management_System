import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../core/services/api.service';
import { ToastService } from '../../core/services/toast.service';
import { API } from '../../core/api/api.config';
import { ApiResponse } from '../../core/models/api.models';
import { TeamMember, TeamStats } from '../../core/models/team.models';

@Component({
  selector: 'app-team',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './team.component.html',
  styleUrls: ['./team.component.scss']
})
export class TeamComponent implements OnInit {
  private api = inject(ApiService);
  private toast = inject(ToastService);

  stats: TeamStats = { totalMembers: 0, admins: 0, employees: 0 };
  members: TeamMember[] = [];
  filteredMembers: TeamMember[] = [];
  searchQuery = '';
  selectedRole = 'all';
  isLoading = true;

  ngOnInit() {
    this.loadStats();
    this.loadMembers();
  }

  loadStats() {
    this.api.get<ApiResponse<TeamStats>>(API.TEAM.STATS).subscribe({
      next: (res) => { if (res.data) this.stats = res.data; },
      error: () => {}
    });
  }

  loadMembers() {
    this.isLoading = true;
    this.api.get<ApiResponse<TeamMember[]>>(API.TEAM.MEMBERS).subscribe({
      next: (res) => {
        this.members = res.data ?? [];
        this.applyFilters();
        this.isLoading = false;
      },
      error: () => {
        this.toast.error('Failed to load team');
        this.isLoading = false;
      }
    });
  }

  applyFilters() {
    let list = this.members;
    if (this.searchQuery) {
      const q = this.searchQuery.toLowerCase();
      list = list.filter(m => m.fullName.toLowerCase().includes(q) || m.email.toLowerCase().includes(q));
    }
    if (this.selectedRole !== 'all') {
      list = list.filter(m => m.role.toLowerCase() === this.selectedRole.toLowerCase());
    }
    this.filteredMembers = list;
  }

  onSearch() { this.applyFilters(); }

  onRoleChange() { this.applyFilters(); }
}
