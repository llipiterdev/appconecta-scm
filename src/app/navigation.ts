import {
  BadgeCheck,
  FileText,
  Home,
  Megaphone,
  Receipt,
  Stethoscope,
  User,
  ClipboardList,
  ListChecks,
} from 'lucide-react';
import type { ComponentType } from 'react';

export type NavigationItem = {
  to: string;
  label: string;
  shortLabel: string;
  icon: ComponentType<{ className?: string }>;
  /** Los elementos primarios aparecen en la barra inferior del movil. */
  primary: boolean;
};

export const navigationItems: NavigationItem[] = [
  { to: '/', label: 'Inicio', shortLabel: 'Inicio', icon: Home, primary: true },
  {
    to: '/documentos',
    label: 'Documentos laborales',
    shortLabel: 'Documentos',
    icon: FileText,
    primary: true,
  },
  {
    to: '/nomina',
    label: 'Desprendibles de nomina',
    shortLabel: 'Nomina',
    icon: Receipt,
    primary: true,
  },
  {
    to: '/solicitudes',
    label: 'Solicitudes a Recursos Humanos',
    shortLabel: 'Solicitudes',
    icon: ClipboardList,
    primary: true,
  },
  { to: '/carne', label: 'Carne virtual', shortLabel: 'Carne', icon: BadgeCheck, primary: true },
  {
    to: '/incapacidades',
    label: 'Registro de incapacidades',
    shortLabel: 'Incapacidades',
    icon: Stethoscope,
    primary: false,
  },
  {
    to: '/estado-solicitudes',
    label: 'Estado de mis solicitudes',
    shortLabel: 'Estado',
    icon: ListChecks,
    primary: false,
  },
  {
    to: '/noticias',
    label: 'Noticias y anuncios',
    shortLabel: 'Noticias',
    icon: Megaphone,
    primary: false,
  },
  { to: '/perfil', label: 'Mi perfil', shortLabel: 'Perfil', icon: User, primary: false },
];

export const primaryNavigationItems = navigationItems.filter((item) => item.primary);
