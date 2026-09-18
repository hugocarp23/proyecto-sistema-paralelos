import React from 'react';
import { Calendar, Clock, MapPin, QrCode, ArrowRight } from 'lucide-react';
import { Ticket } from '../../interfaces/ticket';
import { Badge } from '../common/Badge';
import { Link } from 'react-router-dom';

interface TicketWalletCardProps {
  ticket: Ticket;
  onShowQrModal: (ticket: Ticket) => void;
}

export const TicketWalletCard: React.FC<TicketWalletCardProps> = ({ ticket, onShowQrModal }) => {
  const event = ticket.event;

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString('es-BO', {
        day: 'numeric',
        month: 'short',
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

  return (
    <div className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-5 transition-all shadow-md hover:shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
      <div className="flex items-start gap-4 flex-1">
        <div className="w-14 h-14 rounded-2xl bg-brand-500/10 border border-brand-500/20 flex flex-col items-center justify-center text-brand-400 flex-shrink-0">
          <QrCode className="w-7 h-7" />
        </div>

        <div className="space-y-1.5 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-xs font-semibold text-slate-400">
              {ticket.ticketNumber}
            </span>
            <Badge variant={statusVariant[ticket.status] || 'neutral'} size="sm" dot>
              {ticket.status}
            </Badge>
          </div>

          <h4 className="text-base font-bold text-slate-100 line-clamp-1">
            {event?.title}
          </h4>

          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 pt-1">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-slate-500" />
              <span>{formatDate(event?.date)}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-slate-500" />
              <span>{event?.time}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-slate-500" />
              <span>{event?.location}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2.5 w-full md:w-auto justify-end pt-3 md:pt-0 border-t md:border-t-0 border-slate-800/80">
        <button
          onClick={() => onShowQrModal(ticket)}
          className="flex-1 md:flex-none inline-flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-xl bg-brand-600/20 text-brand-300 hover:bg-brand-600/30 border border-brand-500/30 transition-all"
        >
          <QrCode className="w-3.5 h-3.5" />
          <span>Ver QR</span>
        </button>

        <Link
          to={`/entradas/${ticket.id}`}
          className="flex-1 md:flex-none inline-flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 transition-all"
        >
          <span>Ticket Digital</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
};
