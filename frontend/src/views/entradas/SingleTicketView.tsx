import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ticketService } from '../../services/ticket.service';
import { Ticket } from '../../interfaces/ticket';
import { DigitalTicket } from '../../components/entradas/DigitalTicket';
import { Loader } from '../../components/common/Loader';
import { Button } from '../../components/common/Button';
import { ArrowLeft, Printer } from 'lucide-react';

export const SingleTicketView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTicket = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const data = await ticketService.getById(Number(id));
        setTicket(data);
      } catch (err) {
        console.error('Error al cargar entrada:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchTicket();
  }, [id]);

  if (loading) {
    return <Loader message="Cargando ticket digital..." />;
  }

  if (!ticket) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-xl font-bold text-white">Entrada no encontrada</h2>
        <p className="text-xs text-slate-400">La entrada solicitada no existe o no tienes permiso para visualizarla.</p>
        <Link to="/mis-entradas">
          <Button variant="outline" size="sm">Volver a mis entradas</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto px-4 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <Link
          to="/mis-entradas"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Volver a Billetera</span>
        </Link>

        <Button
          onClick={() => window.print()}
          variant="secondary"
          size="sm"
          icon={<Printer className="w-3.5 h-3.5" />}
        >
          Imprimir / Guardar PDF
        </Button>
      </div>

      <DigitalTicket ticket={ticket} />
    </div>
  );
};
