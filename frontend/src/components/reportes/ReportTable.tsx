import React from 'react';
import { ReportData } from '../../interfaces/report';
import { Badge } from '../common/Badge';

interface ReportTableProps {
  report: ReportData | null;
  loading: boolean;
}

export const ReportTable: React.FC<ReportTableProps> = ({ report, loading }) => {
  if (loading) {
    return (
      <div className="p-12 text-center text-slate-400 bg-slate-900 border border-slate-800 rounded-2xl">
        <div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-sm font-medium">Generando consulta de reporte...</p>
      </div>
    );
  }

  if (!report || report.data.length === 0) {
    return (
      <div className="p-12 text-center text-slate-400 bg-slate-900 border border-slate-800 rounded-2xl">
        <p className="text-sm font-medium">No se encontraron registros para los filtros seleccionados.</p>
      </div>
    );
  }

  // Resumen superior
  const summary = report.summary;

  return (
    <div className="space-y-6">
      {/* Tarjetas de Resumen de Métricas del Reporte */}
      {summary && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {Object.entries(summary).map(([key, val]) => (
            <div key={key} className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
              <span className="text-xs uppercase font-bold text-slate-400 tracking-wider">
                {key.replace(/([A-Z])/g, ' $1').trim()}
              </span>
              <p className="text-xl font-extrabold text-slate-100 mt-1">
                {typeof val === 'number' && key.toLowerCase().includes('revenue')
                  ? `Bs. ${val.toFixed(2)}`
                  : val}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Tabla Dinámica según Tipo */}
      <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900 shadow-md">
        <table className="w-full text-left text-sm text-slate-300">
          <thead className="bg-slate-950/80 text-xs uppercase tracking-wider text-slate-400 border-b border-slate-800">
            {report.type === 'ventas' || report.type === 'ingresos' ? (
              <tr>
                <th className="px-6 py-4">Orden</th>
                <th className="px-6 py-4">Fecha</th>
                <th className="px-6 py-4">Cliente</th>
                <th className="px-6 py-4">Evento</th>
                <th className="px-6 py-4 text-center">Entradas</th>
                <th className="px-6 py-4 text-right">Total</th>
              </tr>
            ) : report.type === 'asistencia' ? (
              <tr>
                <th className="px-6 py-4">Ticket</th>
                <th className="px-6 py-4">Evento</th>
                <th className="px-6 py-4">Asistente</th>
                <th className="px-6 py-4">Hora de Validación</th>
                <th className="px-6 py-4">Validador</th>
              </tr>
            ) : report.type === 'usuarios' ? (
              <tr>
                <th className="px-6 py-4">Nombre</th>
                <th className="px-6 py-4">Correo</th>
                <th className="px-6 py-4">Rol</th>
                <th className="px-6 py-4">Estado</th>
                <th className="px-6 py-4">Fecha Registro</th>
              </tr>
            ) : (
              <tr>
                <th className="px-6 py-4">Número</th>
                <th className="px-6 py-4">Estado</th>
                <th className="px-6 py-4">Fecha</th>
              </tr>
            )}
          </thead>
          <tbody className="divide-y divide-slate-800">
            {report.data.map((row: any, idx: number) => (
              <tr key={row.id || row.orderId || idx} className="hover:bg-slate-800/40 transition-colors">
                {report.type === 'ventas' || report.type === 'ingresos' ? (
                  <>
                    <td className="px-6 py-4 font-mono text-xs font-semibold text-brand-300">
                      #ORD-{row.orderId}
                    </td>
                    <td className="px-6 py-4 text-xs">
                      {new Date(row.date).toLocaleString('es-BO')}
                    </td>
                    <td className="px-6 py-4 font-medium text-slate-100">{row.customer}</td>
                    <td className="px-6 py-4">{row.eventTitle}</td>
                    <td className="px-6 py-4 text-center">{row.ticketsCount}</td>
                    <td className="px-6 py-4 text-right font-bold text-slate-100">
                      Bs. {Number(row.total).toFixed(2)}
                    </td>
                  </>
                ) : report.type === 'asistencia' ? (
                  <>
                    <td className="px-6 py-4 font-mono text-xs text-brand-300">
                      {row.ticketNumber}
                    </td>
                    <td className="px-6 py-4 font-semibold text-slate-100">{row.eventTitle}</td>
                    <td className="px-6 py-4">{row.customer}</td>
                    <td className="px-6 py-4 text-xs text-slate-400">
                      {new Date(row.validatedAt).toLocaleString('es-BO')}
                    </td>
                    <td className="px-6 py-4 font-medium text-brand-400">{row.validator}</td>
                  </>
                ) : report.type === 'usuarios' ? (
                  <>
                    <td className="px-6 py-4 font-semibold text-slate-100">{row.name}</td>
                    <td className="px-6 py-4">{row.email}</td>
                    <td className="px-6 py-4">
                      <Badge variant="primary" size="sm">
                        {row.role}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={row.active ? 'success' : 'danger'} size="sm" dot>
                        {row.active ? 'Activo' : 'Inactivo'}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-400">
                      {new Date(row.registeredAt).toLocaleDateString('es-BO')}
                    </td>
                  </>
                ) : (
                  <>
                    <td className="px-6 py-4 font-mono text-xs">{row.ticketNumber || row.id}</td>
                    <td className="px-6 py-4">{row.status}</td>
                    <td className="px-6 py-4 text-xs">{new Date(row.createdAt).toLocaleDateString()}</td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
