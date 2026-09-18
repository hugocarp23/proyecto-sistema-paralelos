import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { eventService } from '../../services/event.service';
import { purchaseService } from '../../services/purchase.service';
import { useAuth } from '../../context/AuthContext';
import { EventItem } from '../../interfaces/event';
import { PurchaseResult } from '../../interfaces/purchase';
import { Loader } from '../../components/common/Loader';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { getImageUrl } from '../../utils/image';
import {
  Calendar,
  Clock,
  MapPin,
  Tag,
  User,
  ShieldCheck,
  Plus,
  Minus,
  CheckCircle2,
  QrCode,
  ArrowLeft,
  Share2,
} from 'lucide-react';

export const EventDetailView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [event, setEvent] = useState<EventItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [purchaseModalOpen, setPurchaseModalOpen] = useState(false);
  const [purchaseResult, setPurchaseResult] = useState<PurchaseResult | null>(null);
  const [purchaseError, setPurchaseError] = useState<string | null>(null);

  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvent = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const data = await eventService.getById(Number(id));
        setEvent(data);
      } catch (error) {
        console.error('Error al cargar evento:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [id]);

  if (loading) {
    return <Loader message="Cargando información del evento..." />;
  }

  if (!event) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-2xl font-black text-white">Evento no encontrado</h2>
        <p className="text-sm text-slate-400">El evento que buscas no existe o ha sido cancelado.</p>
        <Link to="/eventos">
          <Button variant="outline" size="sm">Volver a la cartelera</Button>
        </Link>
      </div>
    );
  }

  const isSoldOut = event.availableTickets <= 0 || event.status === 'FINALIZADO';
  const totalPrice = event.price * quantity;

  const handleOpenPurchase = () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: `/eventos/${event.id}` } } });
      return;
    }
    setPurchaseModalOpen(true);
  };

  const handleConfirmPurchase = async () => {
    try {
      setIsPurchasing(true);
      setPurchaseError(null);
      const res = await purchaseService.create(event.id, quantity);
      setPurchaseResult(res);

      // Actualizar disponibilidad en pantalla
      setEvent({
        ...event,
        availableTickets: Math.max(0, event.availableTickets - quantity),
      });
    } catch (err: any) {
      setPurchaseError(err.response?.data?.message || 'Error al procesar la compra.');
    } finally {
      setIsPurchasing(false);
    }
  };

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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Botón de retroceso */}
      <Link
        to="/eventos"
        className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Volver a eventos</span>
      </Link>

      {/* Grid Principal: Info del Evento + Tarjeta de Compra */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Columna Izquierda: Imagen y Detalles (2 columnas en desktop) */}
        <div className="lg:col-span-2 space-y-8">
          {/* Banner de Portada */}
          <div className="relative aspect-[16/9] w-full rounded-3xl overflow-hidden border border-slate-800 bg-slate-900 shadow-2xl">
            <img
              src={getImageUrl(event.image, 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&w=1200&q=80')}
              alt={event.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />

            <div className="absolute top-4 left-4 flex gap-2">
              <span className="px-3 py-1 text-xs font-bold bg-slate-900/90 backdrop-blur-md text-brand-300 border border-slate-700/60 rounded-full shadow">
                {event.category?.name}
              </span>
            </div>

            <div className="absolute top-4 right-4">
              {isSoldOut ? (
                <Badge variant="danger" dot>Agotado</Badge>
              ) : event.availableTickets <= 30 ? (
                <Badge variant="warning" dot>Últimas {event.availableTickets} entradas</Badge>
              ) : (
                <Badge variant="success" dot>Disponible</Badge>
              )}
            </div>

            <div className="absolute bottom-6 left-6 right-6">
              <h1 className="text-2xl sm:text-4xl font-black text-white leading-tight">
                {event.title}
              </h1>
            </div>
          </div>

          {/* Ficha técnica rápida */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-5 bg-slate-900 border border-slate-800 rounded-2xl">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-brand-500/10 text-brand-400">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[11px] uppercase font-bold text-slate-400 tracking-wider">Fecha</p>
                <p className="text-xs font-bold text-slate-200 capitalize">{formatDate(event.date)}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[11px] uppercase font-bold text-slate-400 tracking-wider">Horario</p>
                <p className="text-xs font-bold text-slate-200">{event.time} hrs</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[11px] uppercase font-bold text-slate-400 tracking-wider">Lugar</p>
                <p className="text-xs font-bold text-slate-200 truncate">{event.location} • {event.address}</p>
              </div>
            </div>
          </div>

          {/* Descripción del Evento */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4 shadow-md">
            <h3 className="text-lg font-bold text-white">Acerca de este evento</h3>
            <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-line">
              {event.description}
            </p>

            {event.organizer && (
              <div className="pt-6 mt-6 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-brand-400" />
                  <span>Organizado por: <strong className="text-slate-200">{event.organizer.firstName} {event.organizer.lastName}</strong></span>
                </div>
                <span className="font-mono">Aforo Total: {event.capacity} pers.</span>
              </div>
            )}
          </div>
        </div>

        {/* Columna Derecha: Tarjeta Flotante de Compra */}
        <div className="lg:col-span-1 sticky top-24 space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-6">
            <div className="flex items-baseline justify-between">
              <span className="text-xs uppercase font-bold text-slate-400 tracking-wider">
                Precio por Entrada
              </span>
              <span className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-purple-300">
                Bs. {event.price.toFixed(2)}
              </span>
            </div>

            {/* Selector de cantidad */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
                Cantidad de entradas
              </label>
              <div className="flex items-center justify-between p-2 bg-slate-950 border border-slate-800 rounded-2xl">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1 || isSoldOut}
                  className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="text-base font-bold text-white px-4">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(10, Math.min(event.availableTickets, quantity + 1)))}
                  disabled={quantity >= 10 || quantity >= event.availableTickets || isSoldOut}
                  className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <p className="text-[11px] text-slate-500">Máximo 10 entradas por compra.</p>
            </div>

            {/* Resumen de Costo */}
            <div className="p-4 bg-slate-950/60 rounded-2xl border border-slate-800/80 space-y-2 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Subtotal ({quantity} {quantity === 1 ? 'entrada' : 'entradas'})</span>
                <span>Bs. {totalPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Comisión de servicio</span>
                <span className="text-emerald-400 font-semibold">Gratis (Bs. 0.00)</span>
              </div>
              <div className="pt-2 border-t border-slate-800 flex justify-between font-bold text-sm text-slate-100">
                <span>Total a pagar</span>
                <span className="text-brand-400">Bs. {totalPrice.toFixed(2)}</span>
              </div>
            </div>

            {/* Botón Comprar Entradas */}
            <Button
              onClick={handleOpenPurchase}
              disabled={isSoldOut}
              className="w-full"
              size="lg"
            >
              {isSoldOut ? 'Entradas Agotadas' : 'Comprar Entradas Ahora'}
            </Button>

            {/* Garantías */}
            <div className="pt-2 space-y-2 text-[11px] text-slate-500">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Generación instantánea de tickets QR únicos.</span>
              </div>
              <div className="flex items-center gap-2">
                <QrCode className="w-4 h-4 text-brand-400 flex-shrink-0" />
                <span>Escaneo y validación segura en puerta sin filas.</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Checkout / Compra Simulada */}
      <Modal
        isOpen={purchaseModalOpen}
        onClose={() => {
          setPurchaseModalOpen(false);
          setPurchaseResult(null);
          setPurchaseError(null);
        }}
        title={purchaseResult ? '¡Compra Exitosa!' : 'Confirmar Compra de Entradas'}
        maxWidth="md"
      >
        {purchaseResult ? (
          <div className="text-center space-y-6 py-4">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/30">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-bold text-white">✓ Compra realizada correctamente</h3>
              <p className="text-xs text-slate-300">
                Se han emitido <strong className="text-brand-300">{purchaseResult.quantity} entrada(s)</strong> con códigos QR individuales para <strong>{event.title}</strong>.
              </p>
            </div>

            <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 text-left space-y-2 text-xs">
              <p className="font-mono text-slate-400">Orden: #ORD-{purchaseResult.purchaseId}</p>
              <p className="text-slate-300">Total pagado: <strong className="text-white">Bs. {purchaseResult.total.toFixed(2)}</strong></p>
              <p className="text-slate-400">Titular: {user?.firstName} {user?.lastName} ({user?.email})</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                onClick={() => {
                  setPurchaseModalOpen(false);
                  navigate('/mis-entradas');
                }}
                className="w-full"
                size="md"
              >
                Ver Mis Entradas Digitales
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {purchaseError && (
              <div className="p-3.5 bg-rose-500/10 border border-rose-500/25 rounded-2xl text-xs text-rose-400">
                {purchaseError}
              </div>
            )}

            <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-2 text-xs">
              <p className="font-bold text-slate-100 text-sm">{event.title}</p>
              <p className="text-slate-400">{formatDate(event.date)} a las {event.time} hrs</p>
              <p className="text-slate-400">{event.location} • {event.address}</p>
              <div className="pt-2 border-t border-slate-800 flex justify-between font-bold text-white">
                <span>{quantity} x Bs. {event.price.toFixed(2)}</span>
                <span className="text-brand-400">Total: Bs. {totalPrice.toFixed(2)}</span>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-xs text-slate-400">
                Asignado a: <strong className="text-slate-200">{user?.firstName} {user?.lastName}</strong> ({user?.email})
              </p>
              <p className="text-[11px] text-slate-500">
                Para esta versión académica, la transacción se procesa de forma simulada y los tickets QR se emiten instantáneamente.
              </p>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
              <Button
                variant="ghost"
                onClick={() => setPurchaseModalOpen(false)}
                disabled={isPurchasing}
              >
                Cancelar
              </Button>
              <Button
                onClick={handleConfirmPurchase}
                isLoading={isPurchasing}
              >
                Confirmar y Generar QR
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
