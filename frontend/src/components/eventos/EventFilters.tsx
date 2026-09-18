import React from 'react';
import { Filter, RotateCcw } from 'lucide-react';
import { Category } from '../../interfaces/category';

interface EventFiltersProps {
  categories: Category[];
  selectedCategory: string | number;
  onSelectCategory: (catId: string | number) => void;
  selectedLocation: string;
  onSelectLocation: (loc: string) => void;
  maxPrice: number;
  onChangeMaxPrice: (price: number) => void;
  onReset: () => void;
  className?: string;
}

const POPULAR_CITIES = ['Todas', 'Santa Cruz', 'La Paz', 'Cochabamba', 'Tarija', 'Sucre'];

export const EventFilters: React.FC<EventFiltersProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
  selectedLocation,
  onSelectLocation,
  maxPrice,
  onChangeMaxPrice,
  onReset,
  className = '',
}) => {
  return (
    <div className={`bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-6 ${className}`}>
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2 text-slate-200 font-bold text-sm">
          <Filter className="w-4 h-4 text-brand-400" />
          <span>Filtros de Búsqueda</span>
        </div>
        <button
          onClick={onReset}
          className="text-xs text-slate-400 hover:text-brand-300 flex items-center gap-1 transition-colors"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Restablecer</span>
        </button>
      </div>

      {/* Categoría */}
      <div className="space-y-2">
        <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          Categoría
        </label>
        <select
          value={selectedCategory}
          onChange={(e) => onSelectCategory(e.target.value)}
          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-brand-500"
        >
          <option value="">Todas las categorías</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {/* Ciudad / Ubicación */}
      <div className="space-y-2">
        <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          Ciudad / Región
        </label>
        <div className="flex flex-wrap gap-1.5">
          {POPULAR_CITIES.map((city) => {
            const isSelected = (city === 'Todas' && !selectedLocation) || selectedLocation === city;
            return (
              <button
                key={city}
                type="button"
                onClick={() => onSelectLocation(city === 'Todas' ? '' : city)}
                className={`px-3 py-1.5 text-xs rounded-lg font-medium transition-all ${
                  isSelected
                    ? 'bg-brand-600 text-white font-semibold shadow-sm'
                    : 'bg-slate-950 text-slate-400 hover:bg-slate-800 hover:text-slate-200 border border-slate-800'
                }`}
              >
                {city}
              </button>
            );
          })}
        </div>
      </div>

      {/* Rango de Precio */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-400">
          <span className="uppercase tracking-wider">Precio Máximo</span>
          <span className="text-brand-400 font-bold">Hasta Bs. {maxPrice}</span>
        </div>
        <input
          type="range"
          min="20"
          max="500"
          step="10"
          value={maxPrice}
          onChange={(e) => onChangeMaxPrice(Number(e.target.value))}
          className="w-full accent-brand-500 h-2 bg-slate-800 rounded-lg cursor-pointer"
        />
        <div className="flex justify-between text-[11px] text-slate-500">
          <span>Bs. 20</span>
          <span>Bs. 500+</span>
        </div>
      </div>
    </div>
  );
};
