import { SVGProps } from 'react'
import { DashboardIcon as IconName } from '../dashboard/navigation'

const paths: Record<IconName, string> = {
  overview: 'M4 13h6V4H4v9Zm0 7h6v-5H4v5Zm10 0h6v-9h-6v9Zm0-16v5h6V4h-6Z',
  users: 'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2m7-10a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm13 10v-2a4 4 0 0 0-3-3.87m-2-11.96a4 4 0 0 1 0 7.75',
  roles: 'M12 15v4m-4 2h8m-4-8a5 5 0 1 0 0-10 5 5 0 0 0 0 10Zm7 8v-2a7 7 0 0 0-14 0v2',
  content: 'M6 2h9l5 5v15H6V2Zm9 0v6h5M9 13h8M9 17h8M9 9h2',
  news: 'M4 5h16v14H4V5Zm4 3h8M8 12h8M8 16h5M2 7v10',
  events: 'M6 3v3m12-3v3M4 8h16M5 5h14a1 1 0 0 1 1 1v14H4V6a1 1 0 0 1 1-1Zm3 7h3v3H8v-3Z',
  cor: 'M12 22s7-4.35 7-11V5l-7-3-7 3v6c0 6.65 7 11 7 11Zm0-14v4m0 4h.01',
  collaborations: 'M8 12h8m-5-3 3 3-3 3M5 5h5M14 19h5M7 19a4 4 0 0 1 0-8m10-6a4 4 0 0 1 0 8',
  booking: 'M3 5h18v16H3V5Zm4-3v6m10-6v6M3 10h18m-14 4h4v4H7v-4Z',
  governance: 'M3 10h18M5 10v8m4-8v8m6-8v8m4-8v8M2 21h20M12 2 3 7h18l-9-5Z',
  settings: 'M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Zm7.4-3.5a7.8 7.8 0 0 0-.08-1l2-1.55-2-3.46-2.43.98a8 8 0 0 0-1.73-1L14.8 3h-4l-.36 2.97a8 8 0 0 0-1.73 1l-2.43-.98-2 3.46L6.28 11a7.8 7.8 0 0 0 0 2l-2 1.55 2 3.46 2.43-.98a8 8 0 0 0 1.73 1L10.8 21h4l.36-2.97a8 8 0 0 0 1.73-1l2.43.98 2-3.46-2-1.55c.05-.33.08-.66.08-1Z'
}

export default function DashboardIcon({ name, ...props }: SVGProps<SVGSVGElement> & { name: IconName }) {
  const strokeOnly = name !== 'overview'
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" fill={strokeOnly ? 'none' : 'currentColor'} stroke={strokeOnly ? 'currentColor' : 'none'} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d={paths[name]} />
    </svg>
  )
}
