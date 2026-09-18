import React, { useState, useEffect } from 'react';
import { ticketService } from '../../services/ticket.service';
import { Ticket } from '../../interfaces/ticket';
import { TicketWalletCard } from '../../components/entradas/TicketWalletCard';
import { DigitalTicket } from '../../components/entradas/DigitalTicket';
import { Loader } from '../../components/common/Loader';
import { Modal } from '../../components/common/Modal';
import { EmptyState } from '../../components/common/EmptyState';
import { useNavigate } from 'react-router-dom';
import { Wallet, Ticket as TicketIcon, QrCode } from 'lucide-react';

export const MyTicketsWalletView: React.FC = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('TODAS');
  const [selectedTicketForModal, setSelectedTicketForModal] = useState<Ticket | null>(null);
  const navigate = useNavigate();

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const data = await ticketService.getMyTickets();
      setTickets(data);
    } catch (error) {
      console.error('Error al cargar tickets:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const filteredTickets = statusFilter === 'TODAS'
    ? tickets
    : tickets.filter((t) => t.status === statusFilter);

  const activeCount = tickets.filter((t) => t.status === 'ACTIVA').length;
  const usedCount = tickets.filter((t) => t.status === 'UTILIZADA').length;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Cabecera de la Billetera Digital */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-brand-500/10 border border-brand-500/20 text-brand-400">
            <Wallet className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-white">Billetera de Entradas Digitales</h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Accede a tus entradas oficiales con código QR para ingresar a tus eventos
            </p>
          </div>
        </div>

        {/* Resumen numérico rápido */}
        <div className="flex items-center gap-3 text-xs">
          <span className="px-3 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold">
            {activeCount} Activas
          </span>
          <span className="px-3 py-1.5 rounded-xl bg-slate-800 text-slate-400 font-semibold">
            {usedCount} Utilizadas
          </span>
        </div>
      </div>

      {/* Pestañas de Filtro por Estado */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
        {['TODAS', 'ACTIVA', 'UTILIZADA', 'CANCELADA'].map((status) => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
              statusFilter === status
                ? 'bg-brand-600 text-white shadow-md'
                : 'bg-slate-900 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            {status === 'TODAS' ? 'Todas las entradas' : status}
          </button>
        ))}
      </div>

      {/* Contenido: Listado de Tickets */}
      {loading ? (
        <Loader message="Cargando tus entradas desde tu billetera digital..." />
      ) : filteredTickets.length === 0 ? (
        <EmptyState
          title="No tienes entradas en esta sección"
          description="Explora la cartelera de eventos disponibles para adquirir tus próximas entradas."
          actionText="Explorar Eventos"
          onAction={() => navigate('/eventos')}
          icon={<TicketIcon className="w-8 h-8" />}
        />
      ) : (
        <div className="space-y-4">
          {filteredTickets.map((ticket) => (
            <TicketWalletCard
              key={ticket.id}
              ticket={ticket}
              onShowQrModal={(t) => setSelectedTicketForModal(t)}
            />
          ))}
        </div>
      )}

      {/* Modal para Visualizar el QR en Pantalla Completa */}
      <Modal
        isOpen={!!selectedTicketForModal}
        onClose={() => setSelectedTicketForModal(null)}
        maxWidth="md"
      >
        {selectedTicketForModal && (
          <DigitalTicket ticket={selectedTicketForModal} />
        )}
      </Modal>
    </div>
  );
};
