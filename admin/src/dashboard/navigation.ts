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
  navKey: string
  description: string
  permission: string
  icon: DashboardIcon
}

export const dashboardModules: DashboardModule[] = [
  { path: '/', label: 'Overview', navKey: 'overview', description: 'Platform activity and shortcuts', permission: 'dashboard.read', icon: 'overview' },
  { path: '/users', label: 'Users', navKey: 'users', description: 'Accounts and access status', permission: 'users.read', icon: 'users' },
  { path: '/roles', label: 'Roles', navKey: 'roles', description: 'Roles and permission mappings', permission: 'roles.read', icon: 'roles' },
  { path: '/content', label: 'Content', navKey: 'content', description: 'Pages and reusable content', permission: 'content.read', icon: 'content' },
  { path: '/news', label: 'News', navKey: 'news', description: 'News and blog administration', permission: 'news.read', icon: 'news' },
  { path: '/events', label: 'Events', navKey: 'events', description: 'Event publishing and schedules', permission: 'events.read', icon: 'events' },
  { path: '/cor-activities', label: 'Cor Activities', navKey: 'corActivities', description: 'What is happening at Cor', permission: 'cor_activities.read', icon: 'cor' },
  { path: '/collaborations', label: 'Collaborations', navKey: 'collaborations', description: 'Partners and student benefits', permission: 'collaborations.read', icon: 'collaborations' },
  { path: '/booking', label: 'Booking', navKey: 'booking', description: 'Resources and reservations', permission: 'booking.read', icon: 'booking' },
  { path: '/organization', label: 'Organisation', navKey: 'organization', description: 'Board, council, committees, staff, recruitment and alumni', permission: 'organization.read', icon: 'organization' },
  { path: '/representatives', label: 'Studeranderepresentanter', navKey: 'representatives', description: 'Student representative bodies, people, and calls', permission: 'representatives.read', icon: 'organization' },
  { path: '/governance', label: 'Governance', navKey: 'governance', description: 'Boards, meetings, and records', permission: 'governance.read', icon: 'governance' },
  { path: '/settings', label: 'Settings', navKey: 'settings', description: 'Platform configuration', permission: 'settings.read', icon: 'settings' }
]

export function visibleDashboardModules(modules: DashboardModule[], permissions: readonly string[]) {
  const allowed = new Set(permissions)
  return modules.filter((module) => allowed.has(module.permission))
}
