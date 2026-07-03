import { expect, request, test, type APIRequestContext, type Page } from '@playwright/test'

const apiBase = 'http://127.0.0.1:3000/api/v1/'
const adminBase = 'http://127.0.0.1:5174'
const publicBase = 'http://127.0.0.1:5173'
const adminEmail = 'e2e-admin@example.com'
const adminPassword = 'StrongPassword1!'

type Fixtures = { eventSlug: string; partnerSlug: string; partnerName: string; partnerId: string; hiddenName: string; eventId: string }

let fixtures: Fixtures

test.describe.configure({ mode: 'serial' })

test.beforeAll(async () => {
  const api = await request.newContext({ baseURL: apiBase })
  fixtures = await createFixtures(api)
  await api.dispose()
})

async function loginApi(api: APIRequestContext) {
  const response = await api.post('auth/login', { data: { email: adminEmail, password: adminPassword } })
  if (!response.ok()) throw new Error(`E2E API login failed: ${response.status()} ${await response.text()}`)
}

async function createFixtures(api: APIRequestContext): Promise<Fixtures> {
  await loginApi(api)
  const suffix = Date.now().toString(36)
  const partnerName = `E2E Test Partner ${suffix}`
  const hiddenName = `E2E Hidden Partner ${suffix}`
  const partnerSlug = `e2e-test-partner-${suffix}`
  const hiddenSlug = `e2e-hidden-partner-${suffix}`
  const eventSlug = `e2e-event-collaboration-${suffix}`

  const visible = await api.post('admin/collaborations', { data: collaborationPayload({ name: partnerName, slug: partnerSlug, active: true, visible: true }) })
  expect(visible.ok()).toBeTruthy()
  const visibleId = (await visible.json()).data.collaboration.id as string

  const hidden = await api.post('admin/collaborations', { data: collaborationPayload({ name: hiddenName, slug: hiddenSlug, active: false, visible: false }) })
  expect(hidden.ok()).toBeTruthy()
  const hiddenId = (await hidden.json()).data.collaboration.id as string

  const category = await api.post('admin/events/categories', { data: { slug: `e2e-category-${suffix}`, labels: { sv: 'E2E kategori', en: 'E2E category' } } })
  expect(category.ok()).toBeTruthy()
  const categoryId = (await category.json()).data.category.id as string

  const startAt = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString()
  const endAt = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000).toISOString()
  const event = await api.post('admin/events', { data: {
    slug: eventSlug,
    translations: {
      sv: { title: `E2E samarbets-evenemang ${suffix}`, description: 'Svensk beskrivning för E2E.', organizer: 'ASK', location: 'Cor-huset' },
      en: { title: `E2E collaboration event ${suffix}`, description: 'English E2E description.', organizer: 'ASK', location: 'Cor House' },
    },
    startAt,
    endAt,
    categoryId,
    eventStatus: 'scheduled',
    featured: false,
    eventCollaborations: [
      { collaborationId: visibleId, role: 'sponsor', displayOrder: 0, visible: true, note: { sv: 'Synlig testnotis', en: 'Visible test note' } },
      { collaborationId: hiddenId, role: 'sponsor', displayOrder: 1, visible: true, note: { sv: 'Dold testnotis', en: 'Hidden test note' } },
    ],
  } })
  expect(event.ok()).toBeTruthy()
  const created = (await event.json()).data.event
  const published = await api.post(`admin/events/${created.id}/publish`, { data: { expectedVersion: created.version } })
  expect(published.ok()).toBeTruthy()

  return { eventSlug, partnerSlug, partnerName, partnerId: visibleId, hiddenName, eventId: created.id }
}

function collaborationPayload(input: { name: string; slug: string; active: boolean; visible: boolean }) {
  return {
    name: input.name,
    slug: input.slug,
    type: 'sponsor',
    description: { sv: 'Svensk E2E partnerbeskrivning', en: 'English E2E partner description' },
    shortDescription: { sv: 'Svensk korttext', en: 'English short text' },
    logoAltText: { sv: '', en: '' },
    websiteUrl: 'https://example.com',
    contactPerson: '',
    socialLinks: {},
    officeAtCor: false,
    officeHours: { sv: '', en: '' },
    publicContactInfo: { sv: '', en: '' },
    active: input.active,
    visible: input.visible,
    featured: false,
    displayOrder: 10,
    tags: { sv: 'e2e', en: 'e2e' },
    internalNotes: 'Internal E2E note must stay private',
    relationshipOwner: 'E2E owner',
  }
}

async function loginAdmin(page: Page, language: 'sv' | 'en' = 'sv') {
  await page.addInitScript((adminLanguage) => localStorage.setItem('ask-admin-language', adminLanguage), language)
  await page.goto(`${adminBase}/login`)
  await page.getByLabel(language === 'sv' ? 'E-post' : 'Email').fill(adminEmail)
  await page.getByLabel(language === 'sv' ? 'Lösenord' : 'Password').fill(adminPassword)
  await page.getByRole('button', { name: language === 'sv' ? 'Logga in' : 'Sign in' }).click()
  await expect(page.getByText(language === 'sv' ? 'Dina moduler' : 'Your modules')).toBeVisible()
}

async function expectSelectedCollaboration(page: Page, collaborationId: string) {
  await expect.poll(async () => {
    return page.locator('select').evaluateAll((selects, expectedValue) => {
      return selects.some((select) => (select as HTMLSelectElement).value === expectedValue)
    }, collaborationId)
  }).toBe(true)
}

test('admin can view and edit collaborations in Swedish and English', async ({ page }) => {
  await loginAdmin(page, 'sv')
  await page.goto(`${adminBase}/collaborations`)
  await expect(page.getByRole('heading', { name: 'Samarbeten' })).toBeVisible()
  await page.getByRole('button', { name: 'Samarbeten' }).click()
  await page.getByPlaceholder('Sök').fill(fixtures.partnerName)
  await expect(page.getByText(fixtures.partnerName)).toBeVisible()
  await page.getByRole('button', { name: 'Redigera' }).first().click()
  await page.getByPlaceholder('Logo-URL').fill('')
  await page.getByRole('button', { name: 'Spara samarbete' }).click()
  await expect(page.getByText(fixtures.partnerName)).toBeVisible()

  await page.addInitScript(() => localStorage.setItem('ask-admin-language', 'en'))
  await page.reload()
  await expect(page.getByRole('heading', { name: 'Collaborations' })).toBeVisible()
})

test('admin event editor keeps selected collaboration sponsor', async ({ page }) => {
  await loginAdmin(page, 'sv')
  await page.goto(`${adminBase}/events/${fixtures.eventId}`)
  await expect(page.getByText('Samarbeten och sponsorer')).toBeVisible()
  await expectSelectedCollaboration(page, fixtures.partnerId)
  await expect(page.getByText('Sponsor').first()).toBeVisible()
  await page.getByRole('button', { name: 'Save draft' }).click()
  await page.reload()
  await expectSelectedCollaboration(page, fixtures.partnerId)
})

test('public Swedish event detail shows visible collaboration only', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('ask-public-language', 'sv'))
  await page.goto(`${publicBase}/events/${fixtures.eventSlug}`)
  await expect(page.getByRole('heading', { name: /E2E samarbets-evenemang/ })).toBeVisible()
  await expect(page.getByText('I samarbete med')).toBeVisible()
  await expect(page.getByText(fixtures.partnerName)).toBeVisible()
  await expect(page.getByText('Sponsor').first()).toBeVisible()
  await expect(page.getByRole('link', { name: 'Läs mer' })).toHaveAttribute('href', `/samarbeten/${fixtures.partnerSlug}`)
  await expect(page.getByText(fixtures.hiddenName)).toHaveCount(0)
  await expect(page.getByText('In collaboration with')).toHaveCount(0)
  await expect(page.getByText('Samarbeten / Collaborations')).toHaveCount(0)
})

test('public English event detail uses English labels and route', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('ask-public-language', 'en'))
  await page.goto(`${publicBase}/events/${fixtures.eventSlug}`)
  await expect(page.getByRole('heading', { name: /E2E collaboration event/ })).toBeVisible()
  await expect(page.getByText('In collaboration with')).toBeVisible()
  await expect(page.getByText(fixtures.partnerName)).toBeVisible()
  await expect(page.getByRole('link', { name: 'Read more' })).toHaveAttribute('href', `/collaborations/${fixtures.partnerSlug}`)
  await expect(page.getByText(fixtures.hiddenName)).toHaveCount(0)
  await expect(page.getByText('I samarbete med')).toHaveCount(0)
  await expect(page.getByText('Samarbeten / Collaborations')).toHaveCount(0)
})

test('event collaboration link opens public collaboration detail without internal notes', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('ask-public-language', 'sv'))
  await page.goto(`${publicBase}/events/${fixtures.eventSlug}`)
  await page.getByRole('link', { name: 'Läs mer' }).click()
  await expect(page).toHaveURL(new RegExp(`/samarbeten/${fixtures.partnerSlug}$`))
  await expect(page.getByRole('heading', { name: fixtures.partnerName })).toBeVisible()
  await expect(page.getByText('Internal E2E note must stay private')).toHaveCount(0)
  await expect(page.getByText('E2E owner')).toHaveCount(0)
})
