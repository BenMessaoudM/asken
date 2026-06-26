export type DashboardIcon =
  | 'overview'
  | 'users'
  | 'roles'
  | 'content'
  | 'news'
  | 'events'
  | 'cor'
  | 'collaborations'
  | 'booking'
  | 'organization'
  | 'governance'
  | 'settings'

export interface DashboardModule {
  path: string
  label: string
  description: string
  permission: string
  icon: DashboardIcon
}

export const dashboardModules: DashboardModule[] = [
  { path: '/', label: 'Overview', description: 'Platform activity and shortcuts', permission: 'dashboard.read', icon: 'overview' },
  { path: '/users', label: 'Users', description: 'Accounts and access status', permission: 'users.read', icon: 'users' },
  { path: '/roles', label: 'Roles', description: 'Roles and permission mappings', permission: 'roles.read', icon: 'roles' },
  { path: '/content', label: 'Content', description: 'Pages and reusable content', permission: 'content.read', icon: 'content' },
  { path: '/news', label: 'News', description: 'News and blog administration', permission: 'news.read', icon: 'news' },
  { path: '/events', label: 'Events', description: 'Event publishing and schedules', permission: 'events.read', icon: 'events' },
  { path: '/cor-activities', label: 'Cor Activities', description: 'What is happening at Cor', permission: 'cor_activities.read', icon: 'cor' },
  { path: '/collaborations', label: 'Collaborations', description: 'Partners and student benefits', permission: 'collaborations.read', icon: 'collaborations' },
  { path: '/booking', label: 'Booking', description: 'Resources and reservations', permission: 'booking.read', icon: 'booking' },
  { path: '/organization', label: 'Organisation', description: 'Board, council, committees, staff, recruitment and alumni', permission: 'organization.read', icon: 'organization' },
  { path: '/governance', label: 'Governance', description: 'Boards, meetings, and records', permission: 'governance.read', icon: 'governance' },
  { path: '/settings', label: 'Settings', description: 'Platform configuration', permission: 'settings.read', icon: 'settings' }
]

export function visibleDashboardModules(modules: DashboardModule[], permissions: readonly string[]) {
  const allowed = new Set(permissions)
  return modules.filter((module) => allowed.has(module.permission))
}
