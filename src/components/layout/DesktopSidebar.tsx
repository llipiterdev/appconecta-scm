import { NavLink } from 'react-router';

import { navigationItems } from '@/app/navigation';
import { cn } from '@/lib/cn';

export function DesktopSidebar() {
  return (
    <nav aria-label="Navegacion principal" className="hidden w-64 shrink-0 lg:block">
      <ul className="sticky top-20 flex flex-col gap-1">
        {navigationItems.map((item) => (
          <li key={item.to}>
            <NavLink
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-brand-100 text-brand-800'
                    : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                )
              }
            >
              <item.icon className="size-5 shrink-0" aria-hidden="true" />
              {item.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
