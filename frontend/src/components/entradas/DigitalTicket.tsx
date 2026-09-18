import React from 'react';
import { Calendar, Clock, MapPin, CheckCircle, AlertTriangle, XCircle, Share2, Download } from 'lucide-react';
import { Ticket } from '../../interfaces/ticket';
import { QRCodeDisplay } from './QRCodeDisplay';
import { Badge } from '../common/Badge';

interface DigitalTicketProps {
  ticket: Ticket;
}

export const DigitalTicket: React.FC<DigitalTicketProps> = ({ ticket }) => {
  const event = ticket.event;

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString('es-BO', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  const statusVariant = {
    ACTIVA: 'success',
    UTILIZADA: 'neutral',
    CANCELADA: 'danger',
  } as const;

  const statusIcon = {
    ACTIVA: <CheckCircle className="w-4 h-4 text-emerald-400" />,
    UTILIZADA: <AlertTriangle className="w-4 h-4 text-slate-400" />,
    CANCELADA: <XCircle className="w-4 h-4 text-rose-400" />,
  };

  return (
    <div className="max-w-md mx-auto w-full bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl transition-all duration-300 relative">
      {/* Header del Ticket Digital */}
      <div className="bg-gradient-to-r from-brand-700 via-purple-700 to-brand-800 p-6 text-white relative">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center font-black text-sm tracking-wider">
              EH
            </div>
            <span className="font-extrabold tracking-wider text-base">EVENTHUB</span>
          </div>
          <span className="text-xs bg-black/20 backdrop-blur-md px-3 py-1 rounded-full font-mono font-medium">
            {ticket.ticketNumber}
          </span>
        </div>

        <h2 className="text-xl font-black leading-tight tracking-tight line-clamp-2">
          {event?.title || 'Evento EventHub'}
        </h2>

        <div className="mt-3 flex items-center gap-2 text-xs text-brand-100/90 font-medium">
          <Badge variant={statusVariant[ticket.status] || 'neutral'} dot>
            {ticket.status}
          </Badge>
          <span>• Entrada General</span>
        </div>
      </div>

      {/* Detalles del Evento */}
      <div className="p-6 space-y-4 text-slate-200">
        <div className="flex items-start gap-3">
          <Calendar className="w-5 h-5 text-brand-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-xs text-slate-400 uppercase font-bold tracking-wider">Fecha</p>
            <p className="text-sm font-semibold capitalize">{formatDate(event?.date || ticket.createdAt)}</p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <Clock className="w-5 h-5 text-brand-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-xs text-slate-400 uppercase font-bold tracking-wider">Hora de Acceso</p>
            <p className="text-sm font-semibold">{event?.time || '20:00'} hrs</p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <MapPin className="w-5 h-5 text-brand-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-xs text-slate-400 uppercase font-bold tracking-wider">Ubicación y Recinto</p>
            <p className="text-sm font-semibold">{event?.location} — {event?.address}</p>
          </div>
        </div>
      </div>

      {/* Separador Perforado Estilo Ticket Físico */}
      <div className="relative flex items-center justify-center my-2">
        <div className="ticket-notch-left -left-3" />
        <div className="w-full border-t-2 border-dashed border-slate-800 mx-6" />
        <div className="ticket-notch-right -right-3" />
      </div>

      {/* Código QR y Token de Validación */}
      <div className="p-6 flex flex-col items-center justify-center text-center bg-slate-900/50">
        <div className="relative group">
          <QRCodeDisplay value={ticket.qrToken} size={210} />
          {ticket.status === 'UTILIZADA' && (
            <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-xs rounded-2xl flex flex-col items-center justify-center text-slate-300 p-4 border border-slate-700">
              <CheckCircle className="w-12 h-12 text-slate-400 mb-2" />
              <span className="text-sm font-bold uppercase tracking-wider">Entrada Utilizada</span>
              <span className="text-xs text-slate-400 mt-1">
                {ticket.usedAt ? new Date(ticket.usedAt).toLocaleString('es-BO') : ''}
              </span>
            </div>
          )}
          {ticket.status === 'CANCELADA' && (
            <div className="absolute inset-0 bg-rose-950/90 backdrop-blur-xs rounded-2xl flex flex-col items-center justify-center text-rose-200 p-4 border border-rose-700">
              <XCircle className="w-12 h-12 text-rose-400 mb-2" />
              <span className="text-sm font-bold uppercase tracking-wider">Entrada Anulada</span>
            </div>
          )}
        </div>

        <p className="mt-4 text-xs text-slate-400 font-mono tracking-wider break-all max-w-xs">
          Código: <strong className="text-slate-200">{ticket.ticketNumber}</strong>
        </p>

        <p className="mt-2 text-[11px] text-slate-500 max-w-xs leading-relaxed">
          Presenta este código QR en la entrada del evento. El organizador lo escaneará para validar tu asistencia.
        </p>
      </div>

      {/* Pie del Ticket con Acciones */}
      <div className="p-4 bg-slate-950/60 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center gap-1.5 font-medium">
          {statusIcon[ticket.status]}
          <span>Estado: {ticket.status}</span>
        </div>
        <div className="font-bold text-slate-300">
          Precio: Bs. {(event?.price || 0).toFixed(2)}
        </div>
      </div>
    </div>
  );
};
