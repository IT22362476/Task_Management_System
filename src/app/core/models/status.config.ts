export interface StatusConfig {
  value: string;
  label: string;
  color: string;
  icon: string;
}

export const TASK_STATUSES: StatusConfig[] = [
  { value: 'todo', label: 'To Do', color: '#64748b', icon: '○' },
  { value: 'in-progress', label: 'In Progress', color: '#3b82f6', icon: '◎' },
  { value: 'review', label: 'Review', color: '#f59e0b', icon: '◐' },
  { value: 'completed', label: 'Completed', color: '#10b981', icon: '●' }
];

export const PROJECT_STATUSES: StatusConfig[] = [
  { value: 'planning', label: 'Planning', color: '#64748b', icon: '📋' },
  { value: 'in-progress', label: 'In Progress', color: '#3b82f6', icon: '🔄' },
  { value: 'completed', label: 'Completed', color: '#10b981', icon: '✅' },
];

export function getTaskStatusLabel(value: string): string {
  return TASK_STATUSES.find(s => s.value === value)?.label ?? value;
}

export function getTaskStatusColor(value: string): string {
  return TASK_STATUSES.find(s => s.value === value)?.color ?? '#64748b';
}

export function getProjectStatusLabel(value: string): string {
  return PROJECT_STATUSES.find(s => s.value === value)?.label ?? value;
}
