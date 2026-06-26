import { Link } from 'react-router-dom'
import { PublicNewsArticle } from '../news/types'
import Icon from './Icon'
import { formatDate } from '../utils/dateTime'

export default function NewsCard({ article, locale, readMore }: { article: PublicNewsArticle; locale: string; readMore: string }) {
  return <article className="ask-card ask-card-hover group overflow-hidden">
    {article.imageUrl ? <img src={article.imageUrl} alt={article.imageAlt || ''} className="h-48 w-full object-cover transition duration-500 group-hover:scale-[1.03]" /> : <div className="grid h-48 place-items-center bg-gradient-to-br from-ask-50 to-ask-400/25 text-ask-600 dark:from-ask-600/25 dark:to-ask-ink"><Icon name="news" className="h-10 w-10" /></div>}
    <div className="p-6">
      <div className="flex items-center justify-between gap-3 text-xs font-bold uppercase tracking-wider text-ask-600 dark:text-ask-400"><span>{article.categories[0]?.label || 'ASK'}</span><time dateTime={article.publishedAt}>{formatDate(article.publishedAt)}</time></div>
      <h3 className="mt-3 text-xl font-black leading-tight"><Link to={`/news/${article.slug}`}>{article.title}</Link></h3>
      <p className="mt-3 line-clamp-3 text-sm leading-6 text-black/60 dark:text-white/60">{article.summary}</p>
      <Link to={`/news/${article.slug}`} className="mt-5 inline-flex items-center gap-2 font-bold text-ask-600 dark:text-ask-400">{readMore}<Icon name="arrow" className="h-4 w-4" /></Link>
    </div>
  </article>
}
