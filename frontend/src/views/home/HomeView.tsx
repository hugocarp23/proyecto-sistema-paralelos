import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Sparkles, QrCode, ShieldCheck, Zap, ArrowRight, Calendar, MapPin } from 'lucide-react';
import { eventService } from '../../services/event.service';
import { categoryService } from '../../services/category.service';
import { EventItem } from '../../interfaces/event';
import { Category } from '../../interfaces/category';
import { EventGrid } from '../../components/eventos/EventGrid';
import { CategoryPills } from '../../components/categorias/CategoryPills';
import { Loader } from '../../components/common/Loader';
import { Button } from '../../components/common/Button';

export const HomeView: React.FC = () => {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | number>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [eventsData, categoriesData] = await Promise.all([
          eventService.getAll({ status: 'PUBLICADO' }),
          categoryService.getAll(true),
        ]);
        setEvents(eventsData);
        setCategories(categoriesData);
      } catch (error) {
        console.error('Error cargando eventos:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/eventos?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const filteredEvents = selectedCategory
    ? events.filter((e) => String(e.categoryId) === String(selectedCategory))
    : events;

  const featuredEvents = filteredEvents.slice(0, 3);
  const upcomingEvents = filteredEvents.slice(3, 9);

  return (
    <div className="space-y-16 pb-20">
      {/* 26. HERO SECTION */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28 border-b border-slate-900 bg-radial-gradient">
        {/* Luces de fondo decorativas */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-brand-600/20 blur-[130px] rounded-full pointer-events-none" />
        <div className="absolute top-1/3 right-10 w-[400px] h-[250px] bg-purple-600/15 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-300 text-xs font-bold uppercase tracking-wider animate-in fade-in">
            <Sparkles className="w-4 h-4 text-brand-400" />
            <span>Tu entrada digital segura en segundos</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight leading-[1.1] max-w-4xl mx-auto">
            Encuentra tu próximo <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 via-purple-300 to-accent-coral">evento favorito</span>
          </h1>

          <p className="text-slate-300 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Descubre conciertos, deportes, obras de teatro y conferencias. Compra tus tickets al instante y accede fácilmente con tu código QR digital.
          </p>

          {/* BUSCADOR PRINCIPAL HERO */}
          <form
            onSubmit={handleSearchSubmit}
            className="max-w-2xl mx-auto flex flex-col sm:flex-row items-center gap-3 p-2 bg-slate-900/90 border border-slate-800 rounded-3xl shadow-2xl backdrop-blur-md"
          >
            <div className="relative flex-1 w-full">
              <Search className="w-5 h-5 text-slate-400 absolute left-4 top-3.5 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="🔍 Buscar eventos, artistas o ciudades..."
                className="w-full bg-transparent pl-12 pr-4 py-3 text-sm sm:text-base text-slate-100 placeholder-slate-400 focus:outline-none"
              />
            </div>
            <Button type="submit" size="md" className="w-full sm:w-auto px-8 py-3.5 rounded-2xl">
              Buscar Eventos
            </Button>
          </form>

          {/* Estadísticas clave rápidas */}
          <div className="pt-6 flex flex-wrap items-center justify-center gap-6 sm:gap-12 text-xs font-semibold text-slate-400">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Compra 100% Segura</span>
            </div>
            <div className="flex items-center gap-2">
              <QrCode className="w-4 h-4 text-brand-400" />
              <span>Ticket QR Digital Instantáneo</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400" />
              <span>Acceso Rápido Sin Filas</span>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* 30. CATEGORÍAS */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl sm:text-2xl font-black text-white">Explora por Categoría</h2>
            <button
              onClick={() => navigate('/eventos')}
              className="text-xs font-bold text-brand-400 hover:text-brand-300 flex items-center gap-1 transition-colors"
            >
              <span>Ver todas</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <CategoryPills
            categories={categories}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />
        </section>

        {loading ? (
          <Loader message="Cargando los mejores eventos para ti..." />
        ) : (
          <>
            {/* 27. EVENTOS DESTACADOS */}
            {featuredEvents.length > 0 && (
              <section className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-black text-white">Eventos Destacados</h2>
                    <p className="text-xs text-slate-400 mt-1">Los espectáculos más populares y solicitados</p>
                  </div>
                  <button
                    onClick={() => navigate('/eventos')}
                    className="text-xs font-bold text-slate-400 hover:text-white flex items-center gap-1"
                  >
                    <span>Explorar todos</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
                <EventGrid
                  events={featuredEvents}
                  emptyMessage="No hay eventos destacados en esta categoría."
                  onClearFilters={() => setSelectedCategory('')}
                />
              </section>
            )}

            {/* 29. PRÓXIMOS EVENTOS */}
            {upcomingEvents.length > 0 && (
              <section className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-black text-white">Próximos Eventos en Cartelera</h2>
                    <p className="text-xs text-slate-400 mt-1">Fechas confirmadas para las próximas semanas</p>
                  </div>
                </div>
                <EventGrid
                  events={upcomingEvents}
                  emptyMessage="No hay eventos próximos en esta categoría."
                  onClearFilters={() => setSelectedCategory('')}
                />
              </section>
            )}
          </>
        )}

        {/* 24. EXPERIENCIA VISUAL: DESCUBRIR -> ELEGIR -> COMPRAR -> ASISTIR */}
        <section className="bg-gradient-to-br from-slate-900 via-slate-900 to-purple-950/40 border border-slate-800 rounded-3xl p-8 sm:p-12 text-center relative overflow-hidden">
          <div className="max-w-3xl mx-auto space-y-6">
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              ¿Cómo funciona EventHub?
            </h2>
            <p className="text-sm text-slate-300">
              Diseñado para una experiencia fluida desde tu teléfono o computador.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 pt-6">
              <div className="flex flex-col items-center p-4 rounded-2xl bg-slate-950/50 border border-slate-800/80">
                <div className="w-12 h-12 rounded-2xl bg-brand-500/10 text-brand-400 flex items-center justify-center font-black text-lg mb-3">
                  1
                </div>
                <h4 className="text-sm font-bold text-slate-100">Descubre</h4>
                <p className="text-xs text-slate-400 mt-1">Explora eventos por tu ciudad o categoría preferida.</p>
              </div>

              <div className="flex flex-col items-center p-4 rounded-2xl bg-slate-950/50 border border-slate-800/80">
                <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-400 flex items-center justify-center font-black text-lg mb-3">
                  2
                </div>
                <h4 className="text-sm font-bold text-slate-100">Elige & Compra</h4>
                <p className="text-xs text-slate-400 mt-1">Selecciona la cantidad de entradas y confirma tu compra.</p>
              </div>

              <div className="flex flex-col items-center p-4 rounded-2xl bg-slate-950/50 border border-slate-800/80">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-black text-lg mb-3">
                  3
                </div>
                <h4 className="text-sm font-bold text-slate-100">Recibe tu QR</h4>
                <p className="text-xs text-slate-400 mt-1">Tu ticket digital se guarda en tu billetera digital.</p>
              </div>

              <div className="flex flex-col items-center p-4 rounded-2xl bg-slate-950/50 border border-slate-800/80">
                <div className="w-12 h-12 rounded-2xl bg-accent-coral/10 text-accent-coral flex items-center justify-center font-black text-lg mb-3">
                  4
                </div>
                <h4 className="text-sm font-bold text-slate-100">¡Asiste!</h4>
                <p className="text-xs text-slate-400 mt-1">Muestra tu QR en puerta para validación inmediata.</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
