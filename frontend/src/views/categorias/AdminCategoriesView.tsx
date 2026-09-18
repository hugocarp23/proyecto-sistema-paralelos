import React, { useState, useEffect } from 'react';
import { categoryService } from '../../services/category.service';
import { Category } from '../../interfaces/category';
import { Loader } from '../../components/common/Loader';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import { Input } from '../../components/common/Input';
import { Layers, Plus, Edit, Trash2, Power } from 'lucide-react';

export const AdminCategoriesView: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState({ name: '', description: '', icon: 'Sparkles' });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const data = await categoryService.getAll(false);
      setCategories(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleOpenModal = (cat?: Category) => {
    if (cat) {
      setEditingCategory(cat);
      setFormData({
        name: cat.name,
        description: cat.description || '',
        icon: cat.icon || 'Sparkles',
      });
    } else {
      setEditingCategory(null);
      setFormData({ name: '', description: '', icon: 'Sparkles' });
    }
    setError(null);
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.name.trim()) {
      setError('El nombre de la categoría es requerido.');
      return;
    }

    try {
      setSaving(true);
      if (editingCategory) {
        await categoryService.update(editingCategory.id, formData);
      } else {
        await categoryService.create(formData);
      }
      setModalOpen(false);
      fetchCategories();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al guardar la categoría.');
    } finally {
      setSaving(false);
    }
  };

  const handleToggleActive = async (cat: Category) => {
    await categoryService.update(cat.id, { active: !cat.active });
    fetchCategories();
  };

  const handleDelete = async (cat: Category) => {
    if (confirm(`¿Estás seguro de eliminar o desactivar "${cat.name}"?`)) {
      await categoryService.delete(cat.id);
      fetchCategories();
    }
  };

  if (loading) {
    return <Loader message="Cargando catálogo de categorías..." />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Layers className="w-5 h-5 text-brand-400" />
            <span>Gestión de Categorías de Eventos</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Administra las clasificaciones para descubrimiento de eventos en EventHub
          </p>
        </div>

        <Button
          onClick={() => handleOpenModal()}
          size="sm"
          icon={<Plus className="w-4 h-4" />}
        >
          Nueva Categoría
        </Button>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900 shadow-md">
        <table className="w-full text-left text-sm text-slate-300">
          <thead className="bg-slate-950/80 text-xs uppercase tracking-wider text-slate-400 border-b border-slate-800">
            <tr>
              <th className="px-6 py-4">Nombre</th>
              <th className="px-6 py-4">Descripción</th>
              <th className="px-6 py-4 text-center">Eventos Asociados</th>
              <th className="px-6 py-4">Estado</th>
              <th className="px-6 py-4 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {categories.map((cat) => (
              <tr key={cat.id} className="hover:bg-slate-800/40 transition-colors">
                <td className="px-6 py-4 font-bold text-slate-100 flex items-center gap-2">
                  <span>{cat.name}</span>
                </td>
                <td className="px-6 py-4 text-xs text-slate-400 max-w-xs truncate">
                  {cat.description || 'Sin descripción'}
                </td>
                <td className="px-6 py-4 text-center text-xs font-mono font-semibold text-brand-300">
                  {cat._count?.events || 0}
                </td>
                <td className="px-6 py-4">
                  <Badge variant={cat.active ? 'success' : 'neutral'} size="sm" dot>
                    {cat.active ? 'Activa' : 'Inactiva'}
                  </Badge>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <button
                      onClick={() => handleToggleActive(cat)}
                      title={cat.active ? 'Desactivar' : 'Activar'}
                      className={`p-1.5 rounded-lg ${
                        cat.active ? 'text-emerald-400 hover:bg-emerald-500/10' : 'text-slate-500 hover:bg-slate-800'
                      }`}
                    >
                      <Power className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleOpenModal(cat)}
                      title="Editar"
                      className="p-1.5 text-brand-400 hover:bg-slate-800 rounded-lg"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(cat)}
                      title="Eliminar"
                      className="p-1.5 text-rose-400 hover:bg-slate-800 rounded-lg"
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

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingCategory ? 'Editar Categoría' : 'Nueva Categoría'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-xl text-xs">
              {error}
            </div>
          )}

          <Input
            label="Nombre de Categoría"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Ej. Cine, Gastronomía, etc."
            required
          />

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
              Descripción Breve
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={2}
              placeholder="Breve reseña sobre el tipo de eventos de esta categoría..."
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-brand-500"
            />
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-slate-800">
            <Button type="button" variant="ghost" onClick={() => setModalOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" isLoading={saving}>
              Guardar
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
