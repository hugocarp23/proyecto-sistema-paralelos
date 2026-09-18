import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Calendar,
  Ticket,
  LayoutDashboard,
  LogOut,
  User as UserIcon,
  Menu,
  X,
  Search,
  Sparkles,
  QrCode,
} from 'lucide-react';
import { Button } from '../components/common/Button';

export const Navbar: React.FC = () => {
  const { user, isAuthenticated, logout, isAdmin, isOrganizer } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/eventos?search=${encodeURIComponent(searchQuery.trim())}`);
      setMobileMenuOpen(false);
    }
  };

  const getDashboardRoute = () => {
    if (isAdmin) return '/admin/dashboard';
    if (isOrganizer) return '/organizador/dashboard';
    return '/usuario/dashboard';
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/85 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo y Nombre de Marca */}
          <Link to="/" className="flex items-center gap-2.5 flex-shrink-0 group">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-brand-600 to-purple-500 flex items-center justify-center text-white font-black text-lg shadow-lg shadow-brand-500/25 group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-black tracking-tight text-white group-hover:text-brand-300 transition-colors">
                Event<span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-purple-400">Hub</span>
              </span>
              <span className="text-[9px] uppercase tracking-widest text-slate-400 -mt-1 font-semibold">
                Plataforma de Eventos
              </span>
            </div>
          </Link>

          {/* Buscador Rápido en Navbar (Desktop) */}
          <form
            onSubmit={handleSearchSubmit}
            className="hidden md:flex flex-1 max-w-md mx-4 relative"
          >
            <input
              type="text"
              placeholder="Buscar eventos, artistas, ciudades..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900/90 border border-slate-800 rounded-xl pl-9 pr-4 py-1.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500/30 transition-all"
            />
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5 pointer-events-none" />
          </form>

          {/* Navegación Desktop */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-300">
            <Link
              to="/eventos"
              className={`hover:text-white transition-colors ${
                location.pathname === '/eventos' ? 'text-brand-400 font-semibold' : ''
              }`}
            >
              Explorar Eventos
            </Link>

            {isAuthenticated ? (
              <>
                <Link
                  to="/mis-entradas"
                  className={`flex items-center gap-1.5 hover:text-white transition-colors ${
                    location.pathname === '/mis-entradas' ? 'text-brand-400 font-semibold' : ''
                  }`}
                >
                  <Ticket className="w-4 h-4 text-brand-400" />
                  <span>Mis Entradas</span>
                </Link>

                {isOrganizer && (
                  <Link
                    to="/organizador/validar-entrada"
                    className="flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-lg bg-brand-500/10 text-brand-300 border border-brand-500/20 hover:bg-brand-500/20 transition-all"
                  >
                    <QrCode className="w-3.5 h-3.5" />
                    <span>Validar QR</span>
                  </Link>
                )}

                <Link
                  to={getDashboardRoute()}
                  className="flex items-center gap-1.5 hover:text-white transition-colors"
                >
                  <LayoutDashboard className="w-4 h-4 text-purple-400" />
                  <span>Dashboard</span>
                </Link>
              </>
            ) : null}
          </nav>

          {/* Autenticación & Menú de Usuario Desktop */}
          <div className="hidden lg:flex items-center gap-3">
            {isAuthenticated ? (
              <div className="flex items-center gap-3 pl-3 border-l border-slate-800">
                <div className="flex flex-col text-right">
                  <span className="text-xs font-semibold text-slate-200">
                    {user?.firstName} {user?.lastName}
                  </span>
                  <span className="text-[10px] text-brand-400 font-mono font-medium uppercase">
                    {user?.role}
                  </span>
                </div>
                <button
                  onClick={logout}
                  title="Cerrar sesión"
                  className="p-2 text-slate-400 hover:text-rose-400 hover:bg-slate-900 rounded-xl transition-all"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login">
                  <Button variant="ghost" size="sm">
                    Iniciar Sesión
                  </Button>
                </Link>
                <Link to="/registro">
                  <Button size="sm">
                    Registrarse
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Botón Móvil */}
          <div className="flex items-center lg:hidden gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-400 hover:text-white rounded-xl bg-slate-900 border border-slate-800"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Menú Móvil Desplegable */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-slate-800 bg-slate-950 px-4 pt-3 pb-6 space-y-4 animate-in slide-in-from-top-2">
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              placeholder="Buscar eventos, artistas o ciudades..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-brand-500"
            />
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3 pointer-events-none" />
          </form>

          <div className="flex flex-col space-y-2 pt-2 border-t border-slate-900 text-sm font-medium text-slate-300">
            <Link
              to="/eventos"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-xl hover:bg-slate-900 hover:text-white transition-colors"
            >
              Explorar Eventos
            </Link>

            {isAuthenticated ? (
              <>
                <Link
                  to="/mis-entradas"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-slate-900 hover:text-white transition-colors"
                >
                  <Ticket className="w-4 h-4 text-brand-400" />
                  <span>Mis Entradas</span>
                </Link>

                {isOrganizer && (
                  <Link
                    to="/organizador/validar-entrada"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl bg-brand-500/10 text-brand-300 hover:bg-brand-500/20 transition-colors"
                  >
                    <QrCode className="w-4 h-4" />
                    <span>Validar Códigos QR</span>
                  </Link>
                )}

                <Link
                  to={getDashboardRoute()}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-slate-900 hover:text-white transition-colors"
                >
                  <LayoutDashboard className="w-4 h-4 text-purple-400" />
                  <span>Dashboard ({user?.role})</span>
                </Link>

                <div className="pt-3 border-t border-slate-900 flex items-center justify-between px-3">
                  <div>
                    <p className="text-xs font-semibold text-slate-200">{user?.firstName} {user?.lastName}</p>
                    <p className="text-[11px] text-slate-500">{user?.email}</p>
                  </div>
                  <Button
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                    }}
                    variant="ghost"
                    size="sm"
                    className="text-rose-400 hover:text-rose-300"
                  >
                    Cerrar Sesión
                  </Button>
                </div>
              </>
            ) : (
              <div className="pt-3 border-t border-slate-900 grid grid-cols-2 gap-2">
                <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="secondary" size="sm" className="w-full">
                    Iniciar Sesión
                  </Button>
                </Link>
                <Link to="/registro" onClick={() => setMobileMenuOpen(false)}>
                  <Button size="sm" className="w-full">
                    Registrarse
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
