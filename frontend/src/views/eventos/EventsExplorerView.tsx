import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { eventService } from '../../services/event.service';
import { categoryService } from '../../services/category.service';
import { EventItem } from '../../interfaces/event';
import { Category } from '../../interfaces/category';
import { EventGrid } from '../../components/eventos/EventGrid';
import { EventFilters } from '../../components/eventos/EventFilters';
import { Loader } from '../../components/common/Loader';
import { Modal } from '../../components/common/Modal';
import { Filter, Search } from 'lucide-react';
import { Button } from '../../components/common/Button';

export const EventsExplorerView: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialSearch = searchParams.get('search') || '';
  const initialCat = searchParams.get('category') || '';

  const [events, setEvents] = useState<EventItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // Estados de filtros
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState<string | number>(initialCat);
  const [selectedLocation, setSelectedLocation] = useState('');
  const [maxPrice, setMaxPrice] = useState(500);

  // Modal de filtros en móvil
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  useEffect(() => {
    const fetchInit = async () => {
      try {
        const cats = await categoryService.getAll(true);
        setCategories(cats);
      } catch (e) {
        console.error(e);
      }
    };
    fetchInit();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const data = await eventService.getAll({
        search: searchTerm || undefined,
        category: selectedCategory || undefined,
        location: selectedLocation || undefined,
        maxPrice: maxPrice < 500 ? maxPrice : undefined,
        status: 'PUBLICADO',
      });
      setEvents(data);
    } catch (e) {
      console.error('Error al obtener eventos:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [selectedCategory, selectedLocation, maxPrice]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchEvents();
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setSelectedLocation('');
    setMaxPrice(500);
    setSearchParams({});
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Encabezado y Barra de Búsqueda Rápida */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <h1 className="text-3xl font-black text-white">Cartelera de Eventos</h1>
          <p className="text-xs text-slate-400 mt-1">
            Explora y filtra las mejores experiencias, recitales y espectáculos disponibles
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Botón de filtros en Mobile */}
          <button
            onClick={() => setIsMobileFiltersOpen(true)}
            className="lg:hidden flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 text-xs font-bold"
          >
            <Filter className="w-4 h-4 text-brand-400" />
            <span>Filtrar</span>
          </button>

          <form onSubmit={handleSearchSubmit} className="relative flex-1 sm:w-80">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por artista, evento..."
              className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-4 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-brand-500"
            />
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3 pointer-events-none" />
          </form>
        </div>
      </div>

      {/* Contenido: Sidebar (Desktop) + Grid de Eventos */}
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Sidebar de Filtros en Desktop */}
        <div className="hidden lg:block w-72 flex-shrink-0 sticky top-24">
          <EventFilters
            categories={categories}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            selectedLocation={selectedLocation}
            onSelectLocation={setSelectedLocation}
            maxPrice={maxPrice}
            onChangeMaxPrice={setMaxPrice}
            onReset={handleResetFilters}
          />
        </div>

        {/* Modal / Drawer de Filtros en Mobile */}
        <Modal
          isOpen={isMobileFiltersOpen}
          onClose={() => setIsMobileFiltersOpen(false)}
          title="Filtros de Búsqueda"
        >
          <EventFilters
            categories={categories}
            selectedCategory={selectedCategory}
            onSelectCategory={(cat) => {
              setSelectedCategory(cat);
              setIsMobileFiltersOpen(false);
            }}
            selectedLocation={selectedLocation}
            onSelectLocation={(loc) => {
              setSelectedLocation(loc);
              setIsMobileFiltersOpen(false);
            }}
            maxPrice={maxPrice}
            onChangeMaxPrice={setMaxPrice}
            onReset={handleResetFilters}
          />
        </Modal>

        {/* Listado de Resultados */}
        <div className="flex-1 w-full space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Mostrando <strong className="text-slate-200">{events.length}</strong> eventos</span>
            {(selectedCategory || selectedLocation || searchTerm || maxPrice < 500) && (
              <button
                onClick={handleResetFilters}
                className="text-brand-400 hover:text-brand-300 underline font-medium"
              >
                Limpiar todos los filtros
              </button>
            )}
          </div>

          {loading ? (
            <Loader message="Filtrando eventos disponibles..." />
          ) : (
            <EventGrid
              events={events}
              emptyMessage="No hay eventos que coincidan con los criterios seleccionados."
              onClearFilters={handleResetFilters}
            />
          )}
        </div>
      </div>
    </div>
  );
};
