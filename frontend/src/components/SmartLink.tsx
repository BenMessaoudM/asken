import { ReactNode } from 'react'
import { Link } from 'react-router-dom'

export default function SmartLink({ href, className, children, external = false }: { href: string; className?: string; children: ReactNode; external?: boolean }) {
  const isExternal = external || /^(https?:|mailto:|tel:)/.test(href)
  if (isExternal) {
    const opensNewWindow = /^https?:/.test(href)
    return <a href={href} className={className} {...(opensNewWindow ? { target: '_blank', rel: 'noreferrer' } : {})}>{children}</a>
  }
  return <Link to={href} className={className}>{children}</Link>
}
