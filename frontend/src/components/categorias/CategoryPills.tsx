import React from 'react';
import { Category } from '../../interfaces/category';
import {
  Music,
  Trophy,
  Drama,
  Laugh,
  GraduationCap,
  Cpu,
  Palette,
  Sparkles,
  Users,
  Layers,
} from 'lucide-react';

interface CategoryPillsProps {
  categories: Category[];
  selectedCategory: string | number;
  onSelectCategory: (catId: string | number) => void;
}

const ICON_MAP: Record<string, React.ReactNode> = {
  Music: <Music className="w-4 h-4 text-purple-400" />,
  Trophy: <Trophy className="w-4 h-4 text-amber-400" />,
  Drama: <Drama className="w-4 h-4 text-rose-400" />,
  Laugh: <Laugh className="w-4 h-4 text-yellow-400" />,
  GraduationCap: <GraduationCap className="w-4 h-4 text-emerald-400" />,
  Cpu: <Cpu className="w-4 h-4 text-cyan-400" />,
  Palette: <Palette className="w-4 h-4 text-pink-400" />,
  Sparkles: <Sparkles className="w-4 h-4 text-violet-400" />,
  Users: <Users className="w-4 h-4 text-blue-400" />,
};

export const CategoryPills: React.FC<CategoryPillsProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
}) => {
  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
      <button
        onClick={() => onSelectCategory('')}
        className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all duration-200 flex-shrink-0 ${
          selectedCategory === ''
            ? 'bg-gradient-to-r from-brand-600 to-purple-600 text-white shadow-md shadow-brand-500/25 scale-[1.02]'
            : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800'
        }`}
      >
        <Layers className="w-4 h-4 text-brand-300" />
        <span>Todos los eventos</span>
      </button>

      {categories.map((category) => {
        const isSelected = String(selectedCategory) === String(category.id);
        const icon = (category.icon && ICON_MAP[category.icon]) || <Sparkles className="w-4 h-4 text-brand-400" />;

        return (
          <button
            key={category.id}
            onClick={() => onSelectCategory(isSelected ? '' : category.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all duration-200 flex-shrink-0 ${
              isSelected
                ? 'bg-gradient-to-r from-brand-600 to-purple-600 text-white shadow-md shadow-brand-500/25 scale-[1.02]'
                : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800'
            }`}
          >
            {icon}
            <span>{category.name}</span>
            {category._count && category._count.events > 0 && (
              <span className={`px-1.5 py-0.5 text-[10px] rounded-full ${isSelected ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-400'}`}>
                {category._count.events}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};
