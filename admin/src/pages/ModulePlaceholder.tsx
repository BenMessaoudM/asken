import { DashboardModule } from '../dashboard/navigation'
import DashboardIcon from '../components/DashboardIcon'

export default function ModulePlaceholder({ module }: { module: DashboardModule }) {
  return (
    <section className="space-y-6">
      <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-ask-600 to-ask-400 p-6 text-white shadow-xl shadow-ask-600/15 sm:p-8">
        <div className="grid h-12 w-12 place-items-center rounded-2xl bg-white/15"><DashboardIcon name={module.icon} className="h-6 w-6" /></div>
        <h1 className="mt-5 text-3xl font-bold tracking-tight">{module.label}</h1>
        <p className="mt-2 max-w-2xl text-white/78">{module.description}. This protected workspace is ready for its feature implementation in a later epic.</p>
      </div>
      <div className="rounded-2xl border border-black/5 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/5">
        <div className="flex items-start gap-4"><div className="mt-1 h-3 w-3 rounded-full bg-ask-gold shadow-[0_0_0_6px_rgba(224,193,61,.16)]" /><div><h2 className="font-semibold">Module foundation ready</h2><p className="mt-1 text-sm leading-6 text-gray-600 dark:text-white/55">Route protection, permission checks, responsive navigation, and theme support are active. Domain workflows and data management are intentionally outside this epic.</p></div></div>
      </div>
    </section>
  )
}
