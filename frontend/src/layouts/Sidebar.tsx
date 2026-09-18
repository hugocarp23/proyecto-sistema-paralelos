import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  Users,
  Calendar,
  Layers,
  Ticket,
  DollarSign,
  UserCheck,
  FileText,
  BarChart3,
  QrCode,
  PlusCircle,
  ShoppingBag,
  History,
  User as UserIcon,
} from 'lucide-react';

interface SidebarProps {
  onOpenCreateEvent?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onOpenCreateEvent }) => {
  const { user, isAdmin, isOrganizer } = useAuth();

  const adminNav = [
    { to: '/admin/dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { to: '/admin/usuarios', label: 'Usuarios', icon: <Users className="w-4 h-4" /> },
    { to: '/admin/eventos', label: 'Eventos', icon: <Calendar className="w-4 h-4" /> },
    { to: '/admin/categorias', label: 'Categorías', icon: <Layers className="w-4 h-4" /> },
    { to: '/reportes?type=ventas', label: 'Ventas', icon: <DollarSign className="w-4 h-4" /> },
    { to: '/reportes?type=asistencia', label: 'Asistencia', icon: <UserCheck className="w-4 h-4" /> },
    { to: '/reportes', label: 'Reportes', icon: <FileText className="w-4 h-4" /> },
    { to: '/estadisticas', label: 'Estadísticas', icon: <BarChart3 className="w-4 h-4" /> },
  ];

  const organizerNav = [
    { to: '/organizador/dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { to: '/organizador/mis-eventos', label: 'Mis Eventos', icon: <Calendar className="w-4 h-4" /> },
    { to: '/organizador/validar-entrada', label: 'Validar QR', icon: <QrCode className="w-4 h-4" /> },
    { to: '/reportes?type=asistencia', label: 'Control Asistencia', icon: <UserCheck className="w-4 h-4" /> },
    { to: '/reportes?type=ventas', label: 'Entradas Vendidas', icon: <DollarSign className="w-4 h-4" /> },
    { to: '/estadisticas', label: 'Estadísticas', icon: <BarChart3 className="w-4 h-4" /> },
    { to: '/reportes', label: 'Reportes', icon: <FileText className="w-4 h-4" /> },
  ];

  const userNav = [
    { to: '/usuario/dashboard', label: 'Inicio', icon: <LayoutDashboard className="w-4 h-4" /> },
    { to: '/mis-entradas', label: 'Mis Entradas (QR)', icon: <Ticket className="w-4 h-4" /> },
    { to: '/mis-compras', label: 'Mis Compras', icon: <ShoppingBag className="w-4 h-4" /> },
    { to: '/historial', label: 'Historial', icon: <History className="w-4 h-4" /> },
    { to: '/perfil', label: 'Mi Perfil', icon: <UserIcon className="w-4 h-4" /> },
  ];

  const navItems = isAdmin ? adminNav : isOrganizer ? organizerNav : userNav;

  return (
    <aside className="w-full lg:w-64 bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-6 flex-shrink-0 h-fit">
      {/* Información del usuario del Dashboard */}
      <div className="flex items-center gap-3 pb-5 border-b border-slate-800">
        <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-brand-600 to-purple-500 flex items-center justify-center font-black text-sm text-white shadow-md">
          {user?.firstName?.[0] || 'U'}
        </div>
        <div className="flex flex-col min-w-0">
          <span className="text-sm font-bold text-slate-100 truncate">
            {user?.firstName} {user?.lastName}
          </span>
          <span className="text-[11px] font-semibold text-brand-400 uppercase tracking-wider">
            {user?.role}
          </span>
        </div>
      </div>

      {/* Botón rápido Crear Evento para organizadores o admin */}
      {(isOrganizer || isAdmin) && onOpenCreateEvent && (
        <button
          onClick={onOpenCreateEvent}
          className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-brand-600 to-purple-600 hover:from-brand-500 hover:to-purple-500 text-white font-bold text-xs shadow-lg shadow-brand-500/20 transition-all active:scale-[0.98]"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Crear Nuevo Evento</span>
        </button>
      )}

      {/* Enlaces de Navegación del Sidebar */}
      <nav className="space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                isActive
                  ? 'bg-brand-600/15 text-brand-300 border border-brand-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`
            }
          >
            {item.icon}
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};
