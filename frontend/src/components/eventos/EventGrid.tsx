import React from 'react';
import { EventItem } from '../../interfaces/event';
import { EventCard } from './EventCard';
import { EmptyState } from '../common/EmptyState';

interface EventGridProps {
  events: EventItem[];
  emptyMessage?: string;
  onClearFilters?: () => void;
}

export const EventGrid: React.FC<EventGridProps> = ({
  events,
  emptyMessage = 'No encontramos eventos que coincidan con tu búsqueda.',
  onClearFilters,
}) => {
  if (events.length === 0) {
    return (
      <EmptyState
        title="Sin eventos disponibles"
        description={emptyMessage}
        actionText={onClearFilters ? 'Limpiar filtros' : undefined}
        onAction={onClearFilters}
      />
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
      {events.map((event) => (
        <EventCard key={event.id} event={event} />
      ))}
    </div>
  );
};
