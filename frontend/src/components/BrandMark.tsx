import { useTranslation } from 'react-i18next'

export default function BrandMark({ compact = false }: { compact?: boolean }) {
  const { t } = useTranslation()
  return (
    <span className="flex items-center gap-3">
      <span className="relative grid h-11 w-11 shrink-0 place-items-center overflow-hidden rounded-2xl bg-ask-600 font-black text-white shadow-glow">
        <span className="relative z-10 text-lg">A</span>
        <span className="absolute -bottom-3 -right-3 h-7 w-7 rounded-full bg-ask-gold" />
      </span>
      {!compact && <span className="leading-tight"><span className="block font-black tracking-tight text-ask-ink dark:text-white">ASK</span><span className="block text-xs font-semibold text-black/50 dark:text-white/50">{t('brand.subtitle')}</span></span>}
    </span>
  )
}
