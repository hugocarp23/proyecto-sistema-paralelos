import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { reportService } from '../../services/report.service';
import { eventService } from '../../services/event.service';
import { ReportData } from '../../interfaces/report';
import { EventItem } from '../../interfaces/event';
import { ReportFilters } from '../../components/reportes/ReportFilters';
import { ReportTable } from '../../components/reportes/ReportTable';
import { FileText } from 'lucide-react';

export const ReportsView: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialType = searchParams.get('type') || 'ventas';

  const [reportType, setReportType] = useState(initialType);
  const [selectedEventId, setSelectedEventId] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [events, setEvents] = useState<EventItem[]>([]);
  const [report, setReport] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const eventsData = await eventService.getAll();
        setEvents(eventsData);
      } catch (e) {
        console.error(e);
      }
    };
    fetchEvents();
  }, []);

  const handleGenerate = async () => {
    try {
      setLoading(true);
      const data = await reportService.generate({
        type: reportType,
        eventId: selectedEventId ? Number(selectedEventId) : undefined,
        startDate: startDate || undefined,
        endDate: endDate || undefined,
      });
      setReport(data);
    } catch (e) {
      console.error('Error generando reporte:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleGenerate();
  }, [reportType]);

  const handleExportCsv = () => {
    if (!report || report.data.length === 0) {
      alert('No hay datos disponibles para exportar.');
      return;
    }

    const items = report.data;
    const replacer = (key: string, value: any) => (value === null ? '' : value);
    const header = Object.keys(items[0]);
    const csv = [
      header.join(','),
      ...items.map((row: any) =>
        header
          .map((fieldName) => JSON.stringify(row[fieldName], replacer))
          .join(',')
      ),
    ].join('\r\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `EventHub-Reporte-${reportType}-${new Date().toISOString().substring(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8">
      <div className="pb-4 border-b border-slate-800">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <FileText className="w-5 h-5 text-brand-400" />
          <span>Generador de Reportes y Auditoría</span>
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Exporta datos filtrados de ventas, asistencia en puerta, recaudación de ingresos y usuarios registrados
        </p>
      </div>

      <ReportFilters
        reportType={reportType}
        onChangeType={setReportType}
        selectedEventId={selectedEventId}
        onChangeEvent={setSelectedEventId}
        startDate={startDate}
        onChangeStartDate={setStartDate}
        endDate={endDate}
        onChangeEndDate={setEndDate}
        events={events}
        onGenerate={handleGenerate}
        onExportCsv={handleExportCsv}
      />

      <ReportTable report={report} loading={loading} />
    </div>
  );
};
