import React, { useState, useEffect } from 'react';
import { eventService } from '../../services/event.service';
import { statisticsService } from '../../services/statistics.service';
import { categoryService } from '../../services/category.service';
import { useAuth } from '../../context/AuthContext';
import { EventItem, CreateEventPayload } from '../../interfaces/event';
import { DashboardStats } from '../../interfaces/report';
import { Category } from '../../interfaces/category';
import { Loader } from '../../components/common/Loader';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { EventFormModal } from '../../components/eventos/EventFormModal';
import { Link } from 'react-router-dom';
import { getImageUrl } from '../../utils/image';
import {
  Calendar,
  Plus,
  Ticket,
  DollarSign,
  UserCheck,
  QrCode,
  Edit,
  Trash2,
  ExternalLink,
} from 'lucide-react';

export const OrganizerDashboardView: React.FC = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState<EventItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  // Modal para crear / editar evento
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<EventItem | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [eventsData, statsData, catsData] = await Promise.all([
        eventService.getAll({ organizerId: user?.id }),
        statisticsService.getDashboardStats(),
        categoryService.getAll(true),
      ]);
      setEvents(eventsData);
      setStats(statsData);
      setCategories(catsData);
    } catch (error) {
      console.error('Error al cargar dashboard de organizador:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user?.id]);

  const handleSaveEvent = async (data: CreateEventPayload) => {
    if (editingEvent) {
      await eventService.update(editingEvent.id, data);
    } else {
      await eventService.create(data);
    }
    fetchData();
  };

  const handleDeleteEvent = async (id: number) => {
    if (confirm('¿Estás seguro de que deseas eliminar o cancelar este evento?')) {
      await eventService.delete(id);
      fetchData();
    }
  };

  if (loading) {
    return <Loader message="Cargando tus eventos y métricas de organizador..." />;
  }

  return (
    <div className="space-y-8">
      {/* 4 Tarjetas de Métricas del Organizador */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Mis Eventos</span>
            <Calendar className="w-5 h-5 text-brand-400" />
          </div>
          <p className="text-2xl font-black text-white mt-2">{events.length}</p>
          <span className="text-[11px] text-slate-400">En plataforma</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Entradas Vendidas</span>
            <Ticket className="w-5 h-5 text-purple-400" />
          </div>
          <p className="text-2xl font-black text-white mt-2">{stats?.totalTicketsSold || 0}</p>
          <span className="text-[11px] text-purple-400">
            {stats?.totalAvailableTickets || 0} disponibles
          </span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Ingresos Propios</span>
            <DollarSign className="w-5 h-5 text-emerald-400" />
          </div>
          <p className="text-2xl font-black text-white mt-2">
            Bs. {(stats?.totalRevenue || 0).toFixed(2)}
          </p>
          <span className="text-[11px] text-emerald-400">Ventas totales</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Asistencia Registrada</span>
            <UserCheck className="w-5 h-5 text-cyan-400" />
          </div>
          <p className="text-2xl font-black text-white mt-2">{stats?.totalAttendees || 0}</p>
          <span className="text-[11px] text-cyan-400">{stats?.attendanceRate || 0}% de asistencia</span>
        </div>
      </div>

      {/* Botones de acción rápida: Crear evento y Validador */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-6 bg-gradient-to-r from-brand-950/40 to-slate-900 border border-brand-500/20 rounded-3xl">
        <div className="space-y-1 text-center sm:text-left">
          <h3 className="text-lg font-bold text-white">¿Tienes un nuevo espectáculo o conferencia?</h3>
          <p className="text-xs text-slate-400">
            Publica tu evento en minutos y empieza a vender entradas digitales con QR.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Link to="/organizador/validar-entrada" className="flex-1 sm:flex-none">
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              icon={<QrCode className="w-4 h-4" />}
            >
              Escanear QR
            </Button>
          </Link>
          <Button
            onClick={() => {
              setEditingEvent(null);
              setIsModalOpen(true);
            }}
            size="sm"
            className="flex-1 sm:flex-none"
            icon={<Plus className="w-4 h-4" />}
          >
            Publicar Evento
          </Button>
        </div>
      </div>

      {/* Tabla / Lista de Mis Eventos */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-md space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <h3 className="text-base font-bold text-white">Mis Eventos Creados</h3>
          <span className="text-xs text-slate-400">{events.length} registrados</span>
        </div>

        {events.length === 0 ? (
          <p className="text-xs text-slate-400 py-6 text-center">
            Aún no has creado ningún evento. Haz clic en "Publicar Evento" para empezar.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-slate-950/80 text-xs uppercase tracking-wider text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="px-4 py-3">Evento</th>
                  <th className="px-4 py-3">Fecha y Hora</th>
                  <th className="px-4 py-3">Ubicación</th>
                  <th className="px-4 py-3">Precio</th>
                  <th className="px-4 py-3 text-center">Disponibilidad</th>
                  <th className="px-4 py-3">Estado</th>
                  <th className="px-4 py-3 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {events.map((ev) => (
                  <tr key={ev.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="px-4 py-3 font-semibold text-slate-100 flex items-center gap-3">
                      <img
                        src={getImageUrl(ev.image, 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&w=200&q=80')}
                        alt={ev.title}
                        className="w-10 h-10 rounded-xl object-cover"
                      />
                      <span className="line-clamp-1">{ev.title}</span>
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-400">
                      {new Date(ev.date).toLocaleDateString('es-BO')} • {ev.time}
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-300">{ev.location}</td>
                    <td className="px-4 py-3 font-bold text-white">Bs. {ev.price.toFixed(2)}</td>
                    <td className="px-4 py-3 text-center text-xs font-mono">
                      {ev.availableTickets} / {ev.capacity}
                    </td>
                    <td className="px-4 py-3">
                      <Badge
                        variant={
                          ev.status === 'PUBLICADO'
                            ? 'success'
                            : ev.status === 'BORRADOR'
                            ? 'neutral'
                            : 'danger'
                        }
                        size="sm"
                        dot
                      >
                        {ev.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          to={`/eventos/${ev.id}`}
                          title="Ver vista pública"
                          className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => {
                            setEditingEvent(ev);
                            setIsModalOpen(true);
                          }}
                          title="Editar evento"
                          className="p-1.5 text-brand-400 hover:text-brand-300 rounded-lg hover:bg-slate-800"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteEvent(ev.id)}
                          title="Eliminar evento"
                          className="p-1.5 text-rose-400 hover:text-rose-300 rounded-lg hover:bg-slate-800"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal Crear / Editar Evento */}
      <EventFormModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingEvent(null);
        }}
        onSubmit={handleSaveEvent}
        eventToEdit={editingEvent}
        categories={categories}
      />
    </div>
  );
};
