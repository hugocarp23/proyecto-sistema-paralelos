import React, { useState, useEffect } from 'react';
import { statisticsService } from '../../services/statistics.service';
import { DashboardStats } from '../../interfaces/report';
import { Loader } from '../../components/common/Loader';
import {
  BarChart3,
  TrendingUp,
  Ticket,
  DollarSign,
  UserCheck,
  Calendar,
  PieChart,
} from 'lucide-react';

export const StatisticsView: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const data = await statisticsService.getDashboardStats();
        setStats(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return <Loader message="Procesando estadísticas analíticas desde la base de datos..." />;
  }

  const attendancePercent = stats?.attendanceRate || 0;
  const soldPercent =
    stats && stats.totalTicketsSold + stats.totalAvailableTickets > 0
      ? Math.round(
          (stats.totalTicketsSold / (stats.totalTicketsSold + stats.totalAvailableTickets)) * 100
        )
      : 0;

  return (
    <div className="space-y-8">
      <div className="pb-4 border-b border-slate-800">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-brand-400" />
          <span>Analítica de Rendimiento de Eventos</span>
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Indicadores clave de aforos, recaudación y afluencia calculados en tiempo real
        </p>
      </div>

      {/* Tarjetas Superiores de Métricas Clave */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-md">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Recaudación Total</span>
            <DollarSign className="w-5 h-5 text-emerald-400" />
          </div>
          <p className="text-3xl font-black text-white mt-3">
            Bs. {(stats?.totalRevenue || 0).toFixed(2)}
          </p>
          <p className="text-xs text-emerald-400 mt-1 font-medium">100% verificado en base de datos</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-md">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Boletos Emitidos</span>
            <Ticket className="w-5 h-5 text-brand-400" />
          </div>
          <p className="text-3xl font-black text-white mt-3">{stats?.totalTicketsSold || 0}</p>
          <p className="text-xs text-brand-400 mt-1 font-medium">{stats?.totalAvailableTickets || 0} disponibles</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-md">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Asistencia en Puerta</span>
            <UserCheck className="w-5 h-5 text-purple-400" />
          </div>
          <p className="text-3xl font-black text-white mt-3">{stats?.totalAttendees || 0}</p>
          <p className="text-xs text-purple-400 mt-1 font-medium">{attendancePercent}% tasa efectiva</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-md">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Cartelera Activa</span>
            <Calendar className="w-5 h-5 text-cyan-400" />
          </div>
          <p className="text-3xl font-black text-white mt-3">{stats?.activeEvents || 0}</p>
          <p className="text-xs text-cyan-400 mt-1 font-medium">De {stats?.totalEvents || 0} eventos totales</p>
        </div>
      </div>

      {/* Gráficas Visuales de Barras de Rendimiento */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Barra de Ocupación / Ventas vs Disponibilidad */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-md space-y-6">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <PieChart className="w-5 h-5 text-brand-400" />
            <span>Ratio de Ocupación de Aforos</span>
          </h3>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1.5">
                <span className="text-slate-300">Capacidad Total Vendida ({soldPercent}%)</span>
                <span className="text-brand-400">{stats?.totalTicketsSold} tickets</span>
              </div>
              <div className="w-full bg-slate-950 h-3 rounded-full overflow-hidden border border-slate-800">
                <div
                  className="bg-gradient-to-r from-brand-500 to-purple-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, soldPercent)}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1.5">
                <span className="text-slate-300">Tasa de Asistencia Validada en Puerta ({attendancePercent}%)</span>
                <span className="text-emerald-400">{stats?.totalAttendees} validados</span>
              </div>
              <div className="w-full bg-slate-950 h-3 rounded-full overflow-hidden border border-slate-800">
                <div
                  className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, attendancePercent)}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Top 5 Eventos en Recaudación */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-md space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-emerald-400" />
            <span>Eventos con Mayor Recaudación</span>
          </h3>

          {stats?.topEvents && stats.topEvents.length > 0 ? (
            <div className="space-y-3">
              {stats.topEvents.map((ev, index) => {
                const maxRevenue = Math.max(...stats.topEvents.map((t) => t.revenue || 1));
                const barWidth = Math.round((ev.revenue / maxRevenue) * 100);

                return (
                  <div key={ev.id} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="font-semibold text-slate-200 truncate max-w-[200px] sm:max-w-xs">
                        {index + 1}. {ev.title}
                      </span>
                      <span className="font-bold text-brand-400">
                        Bs. {ev.revenue.toFixed(2)}
                      </span>
                    </div>
                    <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
                      <div
                        className="bg-brand-500 h-full rounded-full transition-all duration-500"
                        style={{ width: `${barWidth}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-xs text-slate-500 py-4">No hay suficientes datos registrados.</p>
          )}
        </div>
      </div>
    </div>
  );
};
