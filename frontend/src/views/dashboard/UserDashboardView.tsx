import React, { useState, useEffect } from 'react';
import { ticketService } from '../../services/ticket.service';
import { purchaseService } from '../../services/purchase.service';
import { useAuth } from '../../context/AuthContext';
import { Ticket } from '../../interfaces/ticket';
import { Purchase } from '../../interfaces/purchase';
import { Loader } from '../../components/common/Loader';
import { TicketWalletCard } from '../../components/entradas/TicketWalletCard';
import { Modal } from '../../components/common/Modal';
import { DigitalTicket } from '../../components/entradas/DigitalTicket';
import { Link } from 'react-router-dom';
import { Ticket as TicketIcon, ShoppingBag, Calendar, ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '../../components/common/Button';

export const UserDashboardView: React.FC = () => {
  const { user } = useAuth();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [ticketsData, purchasesData] = await Promise.all([
          ticketService.getMyTickets(),
          purchaseService.getMyPurchases(),
        ]);
        setTickets(ticketsData);
        setPurchases(purchasesData);
      } catch (e) {
        console.error('Error cargando datos del usuario:', e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return <Loader message="Cargando tu información personal..." />;
  }

  const activeTickets = tickets.filter((t) => t.status === 'ACTIVA');
  const recentPurchases = purchases.slice(0, 5);

  return (
    <div className="space-y-8">
      {/* Saludo de bienvenida */}
      <div className="p-6 bg-gradient-to-r from-brand-950/40 via-slate-900 to-purple-950/30 border border-slate-800 rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1 text-center sm:text-left">
          <h2 className="text-2xl font-black text-white">
            ¡Hola, {user?.firstName}! 👋
          </h2>
          <p className="text-xs text-slate-400">
            Aquí tienes el resumen de tus entradas activas para tus próximos eventos.
          </p>
        </div>

        <Link to="/eventos">
          <Button size="sm" icon={<Calendar className="w-4 h-4" />}>
            Explorar Cartelera
          </Button>
        </Link>
      </div>

      {/* Próximas Entradas Activas */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TicketIcon className="w-5 h-5 text-brand-400" />
            <h3 className="text-lg font-bold text-white">Tus Próximas Entradas</h3>
          </div>
          <Link to="/mis-entradas" className="text-xs text-brand-400 hover:underline">
            Ver todas ({tickets.length})
          </Link>
        </div>

        {activeTickets.length === 0 ? (
          <div className="p-8 text-center bg-slate-900 border border-slate-800 rounded-3xl space-y-3">
            <p className="text-sm font-semibold text-slate-300">No tienes entradas activas en este momento.</p>
            <p className="text-xs text-slate-500">¿Listo para salir? Encuentra conciertos, teatro y deportes en vivo.</p>
            <Link to="/eventos">
              <Button variant="outline" size="sm">Ver Eventos Disponibles</Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {activeTickets.slice(0, 3).map((ticket) => (
              <TicketWalletCard
                key={ticket.id}
                ticket={ticket}
                onShowQrModal={(t) => setSelectedTicket(t)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Resumen de Historial de Compras */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-md space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-purple-400" />
            <h3 className="text-base font-bold text-white">Últimas Compras Realizadas</h3>
          </div>
        </div>

        {recentPurchases.length === 0 ? (
          <p className="text-xs text-slate-500 py-4 text-center">No has realizado ninguna compra todavía.</p>
        ) : (
          <div className="divide-y divide-slate-800">
            {recentPurchases.map((purchase) => (
              <div key={purchase.id} className="py-3 flex items-center justify-between text-xs">
                <div>
                  <p className="font-bold text-slate-200">
                    Orden #ORD-{purchase.id} • {purchase.tickets?.length || 1} entrada(s)
                  </p>
                  <p className="text-slate-400 mt-0.5">
                    {new Date(purchase.createdAt).toLocaleDateString('es-BO', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
                <div className="text-right">
                  <span className="font-bold text-white text-sm">
                    Bs. {purchase.total.toFixed(2)}
                  </span>
                  <p className="text-emerald-400 text-[11px] font-semibold">{purchase.status}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal para Visualizar QR */}
      <Modal
        isOpen={!!selectedTicket}
        onClose={() => setSelectedTicket(null)}
        maxWidth="md"
      >
        {selectedTicket && <DigitalTicket ticket={selectedTicket} />}
      </Modal>
    </div>
  );
};
