import Icon from './Icon'
import SmartLink from './SmartLink'

interface HeroAction {
  label: string
  href: string
  external?: boolean
}

interface Props {
  eyebrow: string
  title: string
  description: string
  imageUrl?: string
  action?: HeroAction
  secondaryAction?: HeroAction
  compact?: boolean
}

export default function PageHero({ eyebrow, title, description, imageUrl, action, secondaryAction, compact = false }: Props) {
  return <section className="ask-container pt-6 sm:pt-10">
    <div className={`relative overflow-hidden rounded-[2rem] bg-ask-mesh text-white shadow-2xl ${compact ? 'px-6 py-12 sm:px-10 sm:py-16' : 'min-h-[30rem] px-6 py-14 sm:px-12 sm:py-20 lg:grid lg:grid-cols-[1.1fr_.9fr] lg:items-center lg:gap-12'}`}>
      <div className="absolute -right-24 -top-28 h-80 w-80 rounded-full border border-white/10" />
      <div className="absolute -bottom-44 left-1/3 h-96 w-96 rounded-full bg-ask-400/20 blur-3xl" />
      <div className="relative max-w-3xl">
        <p className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-bold backdrop-blur"><Icon name="sparkles" className="h-4 w-4 text-ask-gold" />{eyebrow}</p>
        <h1 className={`mt-6 font-black leading-[1.04] tracking-[-0.04em] ${compact ? 'text-4xl sm:text-6xl' : 'text-5xl sm:text-6xl lg:text-7xl'}`}>{title}</h1>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-white/75 sm:text-xl">{description}</p>
        {(action || secondaryAction) && <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          {action && <SmartLink href={action.href} external={action.external} className="ask-button-primary bg-ask-gold text-ask-ink shadow-none hover:bg-[#ecd65f]">{action.label}<Icon name="arrow" /></SmartLink>}
          {secondaryAction && <SmartLink href={secondaryAction.href} external={secondaryAction.external} className="ask-button-secondary border-white/20 bg-white/10 text-white hover:border-white/35 hover:bg-white/15">{secondaryAction.label}<Icon name="arrow" /></SmartLink>}
        </div>}
      </div>
      {!compact && <div className="relative mt-10 hidden min-h-72 lg:block" aria-hidden="true">
        {imageUrl ? <img src={imageUrl} alt="" className="absolute inset-0 h-full w-full rounded-[2rem] object-cover opacity-85" /> : <div className="absolute inset-4 rotate-3 rounded-[2.5rem] border border-white/15 bg-white/10 backdrop-blur"><div className="absolute left-8 top-8 h-20 w-20 rounded-3xl bg-ask-gold/90" /><div className="absolute bottom-10 right-10 h-40 w-40 rounded-full border-[24px] border-ask-400/45" /><div className="absolute bottom-16 left-12 text-8xl font-black text-white/15">ASK</div></div>}
      </div>}
    </div>
  </section>
}
