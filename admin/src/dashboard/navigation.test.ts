import { describe, expect, it } from 'vitest'
import { adminTranslations } from '../localization/adminTranslations'
import { dashboardModules, visibleDashboardModules } from './navigation'

describe('dashboard navigation', () => {
  it('shows only modules allowed by permissions', () => {
    const visible = visibleDashboardModules(dashboardModules, ['dashboard.read', 'events.read'])
    expect(visible.map((module) => module.path)).toEqual(['/', '/events'])
  })

  it('exposes organization at the existing admin route for permitted users', () => {
    const organization = dashboardModules.find((module) => module.path === '/organization')
    expect(organization?.permission).toBe('organization.read')
    expect(visibleDashboardModules(dashboardModules, ['organization.read']).map((module) => module.path)).toEqual(['/organization'])
  })

  it('defines every required dashboard module once', () => {
    expect(dashboardModules.map((module) => module.label)).toEqual([
      'Overview', 'Users', 'Roles', 'Content', 'News', 'Events',
      'Cor Activities', 'Collaborations', 'Booking', 'Organisation', 'Studeranderepresentanter', 'Governance', 'Settings'
    ])
    expect(new Set(dashboardModules.map((module) => module.path)).size).toBe(dashboardModules.length)
  })

  it('maps admin navigation keys to Swedish and English labels', () => {
    const labels = dashboardModules.map((module) => adminTranslations.sv.nav[module.navKey as keyof typeof adminTranslations.sv.nav])
    expect(labels).toEqual(['Översikt', 'Användare', 'Roller', 'Innehåll', 'Nyheter', 'Evenemang', 'Cor-aktiviteter', 'Samarbeten', 'Bokning', 'Organisation', 'Studeranderepresentanter', 'Styrning', 'Inställningar'])
    expect(adminTranslations.en.nav.organization).toBe('Organization')
    expect(adminTranslations.en.nav.representatives).toBe('Student Representatives')
  })
})
