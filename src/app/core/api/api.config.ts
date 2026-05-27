export const API = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    GOOGLE: '/auth/google',
    REFRESH: '/auth/refresh'
  },
  PROJECTS: '/projects',
  TASKS: '/tasks',
  USERS: '/users',
  TEAM: {
    BASE: '/team',
    STATS: '/team/stats',
    MEMBERS: '/team/members'
  },
  DASHBOARD: {
    ADMIN: '/dashboard/admin',
    EMPLOYEE: '/dashboard/employee'
  }
};

export function projectLabelsUrl(projectId: string): string {
  return `/projects/${projectId}/labels`;
}

export function projectMembersUrl(projectId: string): string {
  return `/projects/${projectId}/members`;
}
