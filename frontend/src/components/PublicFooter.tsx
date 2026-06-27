import { Link } from 'react-router-dom'
import { useSiteLocale } from '../hooks/useSiteLocale'
import BrandMark from './BrandMark'
import Icon from './Icon'

export default function PublicFooter() {
  const { content } = useSiteLocale()
  const { footer, nav } = content
  return <footer className="border-t border-black/5 bg-white dark:border-white/10 dark:bg-ask-ink">
    <div className="ask-container grid gap-10 py-12 md:grid-cols-[1.3fr_1fr_1fr_1fr]">
      <div><Link to="/" aria-label={nav.home}><BrandMark /></Link><p className="mt-4 max-w-md text-sm leading-6 text-black/60 dark:text-white/60">{footer.description}</p></div>
      <div><h2 className="font-bold">{footer.explore}</h2><ul className="mt-4 space-y-3 text-sm text-black/65 dark:text-white/65"><li><Link className="hover:text-ask-600" to="/news">{nav.news}</Link></li><li><Link className="hover:text-ask-600" to="/events">{nav.events}</Link></li><li><Link className="hover:text-ask-600" to="/membership">{nav.membership}</Link></li><li><Link className="hover:text-ask-600" to="/associations">{nav.associations}</Link></li></ul></div>
      <div><h2 className="font-bold">{footer.information}</h2><ul className="mt-4 space-y-3 text-sm text-black/65 dark:text-white/65"><li><Link className="hover:text-ask-600" to="/organisation">{nav.organization}</Link></li><li><Link className="hover:text-ask-600" to="/organisation/styrelsen">{nav.board}</Link></li><li><Link className="hover:text-ask-600" to="/organisation/fullmaktige">Fullmäktige</Link></li><li><Link className="hover:text-ask-600" to="/styrning">Styrning</Link></li><li><Link className="hover:text-ask-600" to="/styrning/fullmaktige">Fullmäktige dokument</Link></li><li><Link className="hover:text-ask-600" to="/styrning?type=statutes">Stadgar och reglemente</Link></li><li><Link className="hover:text-ask-600" to="/organisation/aldres-rad">Äldres Råd</Link></li><li><Link className="hover:text-ask-600" to="/organisation/studeranderepresentanter">Studeranderepresentanter</Link></li><li><Link className="hover:text-ask-600" to="/alumner">{nav.alumni}</Link></li><li><Link className="hover:text-ask-600" to="/organisation/engagera-dig">{nav.getInvolved}</Link></li></ul></div>
      <div><h2 className="font-bold">{footer.contact}</h2><ul className="mt-4 space-y-3 text-sm text-black/65 dark:text-white/65"><li><a className="flex items-center gap-2 hover:text-ask-600" href="mailto:info@asken.fi"><Icon name="mail" className="h-4 w-4" />info@asken.fi</a></li><li><Link className="hover:text-ask-600" to="/privacy">{footer.privacy}</Link></li><li><Link className="hover:text-ask-600" to="/accessibility">{footer.accessibility}</Link></li><li><Link className="hover:text-ask-600" to="/contact">{nav.contact}</Link></li></ul></div>
    </div>
    <div className="border-t border-black/5 dark:border-white/10"><div className="ask-container flex flex-col gap-2 py-5 text-xs text-black/50 dark:text-white/45 sm:flex-row sm:items-center sm:justify-between"><p>© {new Date().getFullYear()} {content.organizationName}</p><a className="hover:text-ask-600" href="mailto:hello@asken.fi">{footer.harassment}: hello@asken.fi</a></div></div>
  </footer>
}
