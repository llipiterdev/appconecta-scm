import { NavLink } from 'react-router';

import { navigationItems } from '@/app/navigation';
import { cn } from '@/lib/cn';

const secondaryItems = navigationItems.filter((item) => !item.primary);

/**
 * En movil la barra inferior solo alberga los accesos primarios. El resto de secciones se
 * ofrece como una fila desplazable horizontalmente, para no ocultar navegacion detras de un
 * menu adicional.
 */
export function SecondaryNavigation() {
  return (
    <nav aria-label="Secciones adicionales" className="-mx-4 overflow-x-auto px-4 pb-1 lg:hidden">
      <ul className="flex w-max items-center gap-2">
        {secondaryItems.map((item) => (
          <li key={item.to}>
            <NavLink
              to={item.to}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium whitespace-nowrap transition-colors',
                  isActive
                    ? 'border-brand-300 bg-brand-100 text-brand-800'
                    : 'border-slate-300 bg-white text-slate-700'
                )
              }
            >
              <item.icon className="size-4" aria-hidden="true" />
              {item.shortLabel}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
