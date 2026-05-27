export interface TeamMember {
  id: string;
  fullName: string;
  email: string;
  role: string;
  department?: string;
  tasksAssigned: number;
  tasksCompleted: number;
  joinDate: string;
}

export interface TeamStats {
  totalMembers: number;
  admins: number;
  employees: number;
}
