import React, { useState, useEffect } from 'react';
import { purchaseService } from '../../services/purchase.service';
import { Purchase } from '../../interfaces/purchase';
import { Loader } from '../../components/common/Loader';
import { EmptyState } from '../../components/common/EmptyState';
import { Badge } from '../../components/common/Badge';
import { Link } from 'react-router-dom';
import { ShoppingBag, Calendar, QrCode, ArrowRight } from 'lucide-react';

export const UserPurchasesView: React.FC = () => {
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPurchases = async () => {
      try {
        setLoading(true);
        const data = await purchaseService.getMyPurchases();
        setPurchases(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchPurchases();
  }, []);

  if (loading) {
    return <Loader message="Cargando tu historial de compras..." />;
  }

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-slate-800">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <ShoppingBag className="w-5 h-5 text-brand-400" />
          <span>Historial de Compras y Órdenes</span>
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Registro completo de tus transacciones y boletos adquiridos en EventHub
        </p>
      </div>

      {purchases.length === 0 ? (
        <EmptyState
          title="No tienes compras registradas"
          description="Cuando adquieras entradas para un evento, aquí aparecerá el recibo y los accesos a tus tickets."
          icon={<ShoppingBag className="w-8 h-8" />}
        />
      ) : (
        <div className="space-y-4">
          {purchases.map((purchase) => (
            <div
              key={purchase.id}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-800/80 gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-brand-400">
                      #ORD-{purchase.id}
                    </span>
                    <Badge variant="success" size="sm" dot>
                      {purchase.status}
                    </Badge>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {new Date(purchase.createdAt).toLocaleString('es-BO', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>

                <div className="text-left sm:text-right">
                  <span className="text-xs text-slate-400 uppercase font-bold tracking-wider block">
                    Total Pagado
                  </span>
                  <span className="text-lg font-black text-white">
                    Bs. {purchase.total.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Tickets incluidos en la orden */}
              <div className="space-y-2">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Entradas emitidas ({purchase.tickets?.length || 0}):
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {purchase.tickets?.map((t) => (
                    <div
                      key={t.id}
                      className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 flex items-center justify-between text-xs"
                    >
                      <div className="min-w-0 pr-2">
                        <p className="font-bold text-slate-100 truncate">
                          {t.event?.title || 'Evento'}
                        </p>
                        <p className="font-mono text-[11px] text-slate-500">
                          {t.ticketNumber} • {t.status}
                        </p>
                      </div>

                      <Link
                        to={`/entradas/${t.id}`}
                        className="px-2.5 py-1.5 rounded-lg bg-brand-600/20 text-brand-300 hover:bg-brand-600/30 flex items-center gap-1 font-semibold flex-shrink-0"
                      >
                        <QrCode className="w-3.5 h-3.5" />
                        <span>Ver QR</span>
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
