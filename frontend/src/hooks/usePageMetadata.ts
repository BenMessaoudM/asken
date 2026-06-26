import { useEffect } from 'react'
import { getSeoAlternates } from '../localization/languages'
import { useSiteLocale } from './useSiteLocale'

function setMeta(selector: string, attribute: string, value: string) {
  let element = document.head.querySelector<HTMLMetaElement>(selector)
  if (!element) {
    element = document.createElement('meta')
    const [key, name] = attribute === 'property' ? ['property', selector.match(/"(.+)"/)?.[1]] : ['name', selector.match(/"(.+)"/)?.[1]]
    if (name) element.setAttribute(key, name)
    document.head.appendChild(element)
  }
  element.setAttribute('content', value)
}

export function usePageMetadata(title: string, description: string, path: string) {
  const { locale, content } = useSiteLocale()

  useEffect(() => {
    const fullTitle = title === content.organizationName ? title : `${title} | ${content.organizationName}`
    const canonicalUrl = new URL(path, import.meta.env.VITE_SITE_URL || window.location.origin).toString()
    document.title = fullTitle
    document.documentElement.lang = locale
    setMeta('meta[name="description"]', 'name', description)
    setMeta('meta[property="og:title"]', 'property', fullTitle)
    setMeta('meta[property="og:description"]', 'property', description)
    setMeta('meta[property="og:url"]', 'property', canonicalUrl)
    setMeta('meta[property="og:locale"]', 'property', locale === 'sv' ? 'sv_FI' : 'en_FI')

    let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]')
    if (!canonical) {
      canonical = document.createElement('link')
      canonical.rel = 'canonical'
      document.head.appendChild(canonical)
    }
    canonical.href = canonicalUrl
    const alternates = getSeoAlternates(path, import.meta.env.VITE_SITE_URL || window.location.origin)
    alternates.forEach((alternate) => {
      let link = document.head.querySelector<HTMLLinkElement>("link[rel=\"alternate\"][hreflang=\"" + alternate.hreflang + "\"]")
      if (!link) {
        link = document.createElement('link')
        link.rel = 'alternate'
        link.hreflang = alternate.hreflang
        document.head.appendChild(link)
      }
      link.href = alternate.href
    })
  }, [content.organizationName, description, locale, path, title])
}
