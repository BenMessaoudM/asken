import { describe, expect, it } from 'vitest'
import { dashboardModuleLabel, dashboardModules, resolveAdminLanguage, visibleDashboardModules } from './navigation'

describe('dashboard navigation', () => {
  it('shows only modules allowed by permissions', () => {
    const visible = visibleDashboardModules(dashboardModules, ['dashboard.read', 'events.read'])
    expect(visible.map((module) => module.label)).toEqual(['Overview', 'Events'])
  })



  it('exposes organization at the existing admin route for permitted users', () => {
    const organization = dashboardModules.find((module) => module.path === '/organization')
    expect(organization?.permission).toBe('organization.read')
    expect(visibleDashboardModules(dashboardModules, ['organization.read']).map((module) => module.path)).toEqual(['/organization'])
  })

  it('localizes the organization navigation label without mixed sidebar text', () => {
    const organization = dashboardModules.find((module) => module.path === '/organization')!
    expect(dashboardModuleLabel(organization, 'sv')).toBe('Organisation')
    expect(dashboardModuleLabel(organization, 'en')).toBe('Organization')
    expect(dashboardModuleLabel(organization, 'fi')).toBe('Organisation')
    expect(resolveAdminLanguage({ getItem: (key: string) => key === 'ask-admin-language' ? 'en' : null } as Storage)).toBe('en')
  })

  it('defines every required dashboard module once', () => {
    expect(dashboardModules.map((module) => module.label)).toEqual([
      'Overview', 'Users', 'Roles', 'Content', 'News', 'Events',
      'Cor Activities', 'Collaborations', 'Booking', 'Organisation', 'Studeranderepresentanter', 'Governance', 'Settings'
    ])
    expect(new Set(dashboardModules.map((module) => module.path)).size).toBe(dashboardModules.length)
  })
})
