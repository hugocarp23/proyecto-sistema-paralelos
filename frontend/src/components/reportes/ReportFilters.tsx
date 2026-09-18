import React from 'react';
import { EventItem } from '../../interfaces/event';
import { FileSpreadsheet, FileText, Filter } from 'lucide-react';
import { Button } from '../common/Button';

interface ReportFiltersProps {
  reportType: string;
  onChangeType: (type: string) => void;
  selectedEventId: string;
  onChangeEvent: (eventId: string) => void;
  startDate: string;
  onChangeStartDate: (date: string) => void;
  endDate: string;
  onChangeEndDate: (date: string) => void;
  events: EventItem[];
  onGenerate: () => void;
  onExportCsv: () => void;
}

const REPORT_TYPES = [
  { id: 'ventas', label: 'Reporte de Ventas' },
  { id: 'ingresos', label: 'Reporte de Ingresos' },
  { id: 'asistencia', label: 'Reporte de Asistencia' },
  { id: 'entradas', label: 'Reporte de Entradas Emitidas' },
  { id: 'usuarios', label: 'Reporte de Usuarios Registrados' },
];

export const ReportFilters: React.FC<ReportFiltersProps> = ({
  reportType,
  onChangeType,
  selectedEventId,
  onChangeEvent,
  startDate,
  onChangeStartDate,
  endDate,
  onChangeEndDate,
  events,
  onGenerate,
  onExportCsv,
}) => {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-md">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-2 text-slate-100 font-bold text-base">
          <Filter className="w-5 h-5 text-brand-400" />
          <span>Configuración y Filtros del Reporte</span>
        </div>

        <div className="flex items-center gap-2">
          <Button
            onClick={onExportCsv}
            variant="secondary"
            size="sm"
            icon={<FileSpreadsheet className="w-4 h-4 text-emerald-400" />}
          >
            Exportar CSV / Excel
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Tipo de Reporte */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
            Tipo de Reporte
          </label>
          <select
            value={reportType}
            onChange={(e) => onChangeType(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-brand-500"
          >
            {REPORT_TYPES.map((rt) => (
              <option key={rt.id} value={rt.id}>
                {rt.label}
              </option>
            ))}
          </select>
        </div>

        {/* Filtrar por Evento (si aplica) */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
            Evento Específico
          </label>
          <select
            value={selectedEventId}
            onChange={(e) => onChangeEvent(e.target.value)}
            disabled={reportType === 'usuarios'}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-brand-500 disabled:opacity-50"
          >
            <option value="">Todos los eventos</option>
            {events.map((ev) => (
              <option key={ev.id} value={ev.id}>
                {ev.title}
              </option>
            ))}
          </select>
        </div>

        {/* Fecha Inicial */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
            Fecha Desde
          </label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => onChangeStartDate(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-brand-500"
          />
        </div>

        {/* Fecha Final */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
            Fecha Hasta
          </label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => onChangeEndDate(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-brand-500"
          />
        </div>
      </div>

      <div className="flex justify-end">
        <Button onClick={onGenerate} size="md">
          Generar Reporte
        </Button>
      </div>
    </div>
  );
};
