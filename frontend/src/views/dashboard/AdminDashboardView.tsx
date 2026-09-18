import React, { useState, useEffect } from 'react';
import { statisticsService } from '../../services/statistics.service';
import { DashboardStats } from '../../interfaces/report';
import { Loader } from '../../components/common/Loader';
import { Link } from 'react-router-dom';
import {
  Users,
  Calendar,
  Ticket,
  DollarSign,
  UserCheck,
  TrendingUp,
  Layers,
  ArrowUpRight,
  Sparkles,
} from 'lucide-react';

export const AdminDashboardView: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const data = await statisticsService.getDashboardStats();
        setStats(data);
      } catch (error) {
        console.error('Error al cargar estadísticas:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return <Loader message="Cargando métricas globales de EventHub..." />;
  }

  return (
    <div className="space-y-8">
      {/* 6 Tarjetas Principales de Métricas Globales */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-md relative overflow-hidden group hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Eventos</span>
            <div className="p-2.5 rounded-2xl bg-brand-500/10 text-brand-400">
              <Calendar className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-black text-white mt-3">{stats?.totalEvents || 0}</p>
          <p className="text-xs text-brand-400 font-medium mt-1">
            {stats?.activeEvents || 0} eventos activos publicados
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-md relative overflow-hidden group hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Entradas Vendidas</span>
            <div className="p-2.5 rounded-2xl bg-purple-500/10 text-purple-400">
              <Ticket className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-black text-white mt-3">{stats?.totalTicketsSold || 0}</p>
          <p className="text-xs text-purple-400 font-medium mt-1">
            {stats?.totalAvailableTickets || 0} aún disponibles
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-md relative overflow-hidden group hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Ingresos Totales</span>
            <div className="p-2.5 rounded-2xl bg-emerald-500/10 text-emerald-400">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-black text-white mt-3">
            Bs. {(stats?.totalRevenue || 0).toFixed(2)}
          </p>
          <p className="text-xs text-emerald-400 font-medium mt-1">Ventas brutas registradas</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-md relative overflow-hidden group hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Asistentes Validados</span>
            <div className="p-2.5 rounded-2xl bg-cyan-500/10 text-cyan-400">
              <UserCheck className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-black text-white mt-3">{stats?.totalAttendees || 0}</p>
          <p className="text-xs text-cyan-400 font-medium mt-1">
            Tasa de asistencia: {stats?.attendanceRate || 0}%
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-md relative overflow-hidden group hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Módulo Usuarios</span>
            <div className="p-2.5 rounded-2xl bg-amber-500/10 text-amber-400">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <Link
            to="/admin/usuarios"
            className="inline-flex items-center gap-1 text-sm font-bold text-amber-400 hover:text-amber-300 mt-4"
          >
            <span>Gestionar Cuentas y Roles</span>
            <ArrowUpRight className="w-4 h-4" />
          </Link>
          <p className="text-xs text-slate-400 mt-1">Activar o suspender accesos</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-md relative overflow-hidden group hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Categorías</span>
            <div className="p-2.5 rounded-2xl bg-rose-500/10 text-rose-400">
              <Layers className="w-5 h-5" />
            </div>
          </div>
          <Link
            to="/admin/categorias"
            className="inline-flex items-center gap-1 text-sm font-bold text-rose-400 hover:text-rose-300 mt-4"
          >
            <span>Administrar Categorías</span>
            <ArrowUpRight className="w-4 h-4" />
          </Link>
          <p className="text-xs text-slate-400 mt-1">Configuración del catálogo</p>
        </div>
      </div>

      {/* Top Eventos Más Vendidos */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-md space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-brand-400" />
            <h3 className="text-base font-bold text-white">Eventos con Mayor Demanda</h3>
          </div>
          <Link to="/reportes?type=ventas" className="text-xs text-brand-400 hover:underline">
            Ver reporte de ventas
          </Link>
        </div>

        {stats?.topEvents && stats.topEvents.length > 0 ? (
          <div className="divide-y divide-slate-800">
            {stats.topEvents.map((ev, index) => (
              <div key={ev.id} className="py-3.5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-slate-800 text-slate-300 flex items-center justify-center font-bold text-xs">
                    {index + 1}
                  </span>
                  <div>
                    <h4 className="text-sm font-bold text-slate-100">{ev.title}</h4>
                    <span className="text-xs text-slate-400">
                      {ev.soldTickets} entradas emitidas
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-sm font-bold text-brand-400">
                    Bs. {ev.revenue.toFixed(2)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-slate-400 py-4">No hay datos de ventas registrados aún.</p>
        )}
      </div>
    </div>
  );
};
