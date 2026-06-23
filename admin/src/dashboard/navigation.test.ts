import { describe, expect, it } from 'vitest'
import { dashboardModules, visibleDashboardModules } from './navigation'

describe('dashboard navigation', () => {
  it('shows only modules allowed by permissions', () => {
    const visible = visibleDashboardModules(dashboardModules, ['dashboard.read', 'events.read'])
    expect(visible.map((module) => module.label)).toEqual(['Overview', 'Events'])
  })

  it('defines every required dashboard module once', () => {
    expect(dashboardModules.map((module) => module.label)).toEqual([
      'Overview', 'Users', 'Roles', 'Content', 'News', 'Events',
      'Cor Activities', 'Collaborations', 'Booking', 'Governance', 'Settings'
    ])
    expect(new Set(dashboardModules.map((module) => module.path)).size).toBe(dashboardModules.length)
  })
})
