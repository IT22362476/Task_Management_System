export interface AdminDashboard {
  taskStats: TaskStats;
  projectProgress: ProjectProgress[];
  recentActivity: Activity[];
  upcomingDeadlines: Deadline[];
}

export interface EmployeeDashboard {
  taskStats: TaskStats;
  recentActivity: Activity[];
  upcomingDeadlines: Deadline[];
  completionRate: number;
}

export interface TaskStats {
  total: number;
  todo: number;
  inProgress: number;
  review: number;
  completed: number;
  overdue: number;
}

export interface ProjectProgress {
  id: string;
  name: string;
  percent: number;
}

export interface Activity {
  id: string;
  action: string;
  description?: string;
  actorName: string;
  createdAt: string;
}

export interface Deadline {
  taskId: string;
  title: string;
  projectName: string;
  dueDate?: string;
  daysRemaining: number;
}
