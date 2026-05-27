import { Label } from './task.models';

export interface ProjectSummary {
  id: string;
  name: string;
  description?: string;
  status: string;
  ownerName: string;
  ownerAvatar?: string;
  memberCount: number;
  totalTasks: number;
  completedTasks: number;
  progressPercent: number;
  createdAt: string;
}

export interface ProjectDetail extends ProjectSummary {
  ownerId: string;
  members: ProjectMember[];
  tasks: TaskSummaryItem[];
  labels: Label[];
  updatedAt?: string;
}

export interface ProjectMember {
  id: string;
  userId: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
}

export interface TaskSummaryItem {
  id: string;
  title: string;
  status: string;
  priority: string;
  assigneeName?: string;
  dueDate?: string;
}

export interface CreateProjectRequest {
  name: string;
  description?: string;
  status?: string;
}

export interface UpdateProjectRequest {
  name?: string;
  description?: string;
  status?: string;
}

export interface AddMemberRequest {
  userId: string;
  role?: string;
}

export interface CreateLabelRequest {
  name: string;
  color: string;
}

export interface UpdateLabelRequest {
  name?: string;
  color?: string;
}
