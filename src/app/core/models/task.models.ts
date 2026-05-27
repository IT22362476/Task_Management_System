export interface TaskSummary {
  id: string;
  title: string;
  description?: string;
  status: string;
  priority: string;
  projectName: string;
  assigneeName?: string;
  labels: Label[];
  dueDate?: string;
  createdAt: string;
}

export interface TaskDetail {
  id: string;
  title: string;
  description?: string;
  status: string;
  priority: string;
  projectId: string;
  projectName: string;
  assigneeId?: string;
  assigneeName?: string;
  assigneeAvatar?: string;
  createdById: string;
  createdByName: string;
  labels: Label[];
  comments: Comment[];
  dueDate?: string;
  createdAt: string;
  updatedAt?: string;
  completedAt?: string;
}

export interface Label {
  id: string;
  name: string;
  color: string;
}

export interface Comment {
  id: string;
  content: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateTaskRequest {
  title: string;
  description?: string;
  priority: string;
  projectId: string;
  assigneeId?: string;
  dueDate?: string;
  labels?: string[];
}

export interface UpdateTaskRequest {
  title?: string;
  description?: string;
  status?: string;
  priority?: string;
  assigneeId?: string;
  dueDate?: string;
  labels?: string[];
}

export interface AddCommentRequest {
  content: string;
}
