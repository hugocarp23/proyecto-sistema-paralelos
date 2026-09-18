import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ShieldCheck, QrCode, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-slate-900 bg-slate-950 text-slate-400 text-xs mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Columna 1: Brand & Misión */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-brand-600 to-purple-500 flex items-center justify-center text-white font-black text-sm">
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="text-lg font-black text-white tracking-tight">
                Event<span className="text-brand-400">Hub</span>
              </span>
            </div>
            <p className="text-slate-400 leading-relaxed text-xs">
              La plataforma integral más avanzada para descubrir, comprar entradas seguras y controlar la asistencia a eventos mediante códigos QR.
            </p>
          </div>

          {/* Columna 2: Descubrimiento */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Descubrir Eventos
            </h4>
            <ul className="space-y-1.5">
              <li><Link to="/eventos?category=Música" className="hover:text-white transition-colors">Conciertos y Festivales</Link></li>
              <li><Link to="/eventos?category=Deportes" className="hover:text-white transition-colors">Eventos Deportivos</Link></li>
              <li><Link to="/eventos?category=Cultura" className="hover:text-white transition-colors">Teatro y Danza</Link></li>
              <li><Link to="/eventos?category=Tecnología" className="hover:text-white transition-colors">Cumbres de Tecnología</Link></li>
              <li><Link to="/eventos" className="hover:text-white transition-colors">Todos los eventos</Link></li>
            </ul>
          </div>

          {/* Columna 3: Para Organizadores */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Para Organizadores
            </h4>
            <ul className="space-y-1.5">
              <li><Link to="/organizador/dashboard" className="hover:text-white transition-colors">Panel de Control</Link></li>
              <li><Link to="/organizador/validar-entrada" className="hover:text-white transition-colors">Validador de Códigos QR</Link></li>
              <li><Link to="/reportes" className="hover:text-white transition-colors">Estadísticas y Reportes</Link></li>
              <li><span className="text-slate-500">Gestión de Aforos en Tiempo Real</span></li>
            </ul>
          </div>

          {/* Columna 4: Garantías y Seguridad */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Seguridad Garantizada
            </h4>
            <div className="flex items-start gap-2 text-slate-400">
              <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
              <span>Entradas protegidas criptográficamente contra clonación y falsificación.</span>
            </div>
            <div className="flex items-start gap-2 text-slate-400">
              <QrCode className="w-4 h-4 text-brand-400 flex-shrink-0 mt-0.5" />
              <span>Validación instantánea de asistencia en puerta.</span>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <p>© {new Date().getFullYear()} EventHub Inc. Todos los derechos reservados.</p>
          <div className="flex items-center gap-1">
            <span>Diseñado con pasión para los amantes de los eventos en vivo</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 inline" />
          </div>
        </div>
      </div>
    </footer>
  );
};
