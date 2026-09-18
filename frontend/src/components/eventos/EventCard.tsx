import React from 'react';
import { Calendar, Clock, MapPin, Tag } from 'lucide-react';
import { EventItem } from '../../interfaces/event';
import { Badge } from '../common/Badge';
import { Link } from 'react-router-dom';
import { getImageUrl } from '../../utils/image';

interface EventCardProps {
  event: EventItem;
}

export const EventCard: React.FC<EventCardProps> = ({ event }) => {
  const isSoldOut = event.availableTickets <= 0 || event.status === 'FINALIZADO';
  const isFewLeft = event.availableTickets > 0 && event.availableTickets <= 30;

  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('es-BO', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="group relative flex flex-col bg-slate-900 border border-slate-800/80 hover:border-brand-500/50 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl hover:shadow-brand-500/10 transition-all duration-300 transform hover:-translate-y-1">
      {/* Imagen del Evento con Badge de Disponibilidad */}
      <div className="relative aspect-[16/9] w-full overflow-hidden bg-slate-950">
        <img
          src={getImageUrl(event.image)}
          alt={event.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent" />

        {/* Estado y Categoría sobre la imagen */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-2">
          {event.category && (
            <span className="px-2.5 py-1 text-xs font-semibold bg-slate-900/90 backdrop-blur-md text-brand-300 border border-slate-700/60 rounded-full shadow">
              {event.category.name}
            </span>
          )}
        </div>

        <div className="absolute top-3 right-3">
          {isSoldOut ? (
            <Badge variant="danger" dot>Agotado</Badge>
          ) : isFewLeft ? (
            <Badge variant="warning" dot>¡Últimas {event.availableTickets}!</Badge>
          ) : (
            <Badge variant="success" dot>Disponible</Badge>
          )}
        </div>

        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-slate-300 font-medium">
          <div className="flex items-center gap-1.5 bg-slate-900/80 backdrop-blur-md px-2.5 py-1 rounded-lg border border-slate-800">
            <Calendar className="w-3.5 h-3.5 text-brand-400" />
            <span>{formatDate(event.date)}</span>
          </div>
          <div className="flex items-center gap-1.5 bg-slate-900/80 backdrop-blur-md px-2.5 py-1 rounded-lg border border-slate-800">
            <Clock className="w-3.5 h-3.5 text-brand-400" />
            <span>{event.time}</span>
          </div>
        </div>
      </div>

      {/* Contenido Principal */}
      <div className="flex flex-col flex-1 p-5">
        <h3 className="text-base font-bold text-slate-100 line-clamp-1 group-hover:text-brand-300 transition-colors">
          {event.title}
        </h3>

        <div className="mt-2 flex items-center gap-1.5 text-xs text-slate-400">
          <MapPin className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
          <span className="truncate">{event.location} • {event.address}</span>
        </div>

        <p className="mt-2.5 text-xs text-slate-400 line-clamp-2 leading-relaxed flex-1">
          {event.description}
        </p>

        {/* Separador y Pie con Precio y Botón */}
        <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between">
          <div>
            <span className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider">
              Desde
            </span>
            <span className="text-lg font-black text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-purple-300">
              Bs. {event.price.toFixed(2)}
            </span>
          </div>

          <Link
            to={`/eventos/${event.id}`}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all shadow-sm ${
              isSoldOut
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed pointer-events-none'
                : 'bg-gradient-to-r from-brand-600 to-purple-600 hover:from-brand-500 hover:to-purple-500 text-white shadow-brand-500/20 hover:shadow-brand-500/40 hover:shadow-md active:scale-95'
            }`}
          >
            {isSoldOut ? 'Agotado' : 'Comprar entradas'}
          </Link>
        </div>
      </div>
    </div>
  );
};
