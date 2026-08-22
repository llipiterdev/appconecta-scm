import { NavLink } from 'react-router';

import { primaryNavigationItems } from '@/app/navigation';
import { cn } from '@/lib/cn';

export function MobileNavigation() {
  return (
    <nav
      aria-label="Navegacion principal movil"
      className="fixed inset-x-0 bottom-0 z-20 border-t border-slate-200 bg-white pb-[env(safe-area-inset-bottom)] lg:hidden"
    >
      <ul className="flex items-stretch justify-around">
        {primaryNavigationItems.map((item) => (
          <li key={item.to} className="flex-1">
            <NavLink
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                cn(
                  'flex min-h-14 flex-col items-center justify-center gap-0.5 px-1 py-2 text-[11px] font-medium transition-colors',
                  isActive ? 'text-brand-700' : 'text-slate-500'
                )
              }
            >
              <item.icon className="size-5" aria-hidden="true" />
              <span className="truncate">{item.shortLabel}</span>
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
