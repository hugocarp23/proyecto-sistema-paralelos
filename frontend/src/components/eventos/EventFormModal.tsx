import React, { useState, useEffect, useRef } from 'react';
import { Modal } from '../common/Modal';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import { Category } from '../../interfaces/category';
import { EventItem, CreateEventPayload } from '../../interfaces/event';
import { uploadService } from '../../services/upload.service';
import { getImageUrl } from '../../utils/image';
import { Upload, Image as ImageIcon, X, Loader2, Link2, RefreshCw } from 'lucide-react';

interface EventFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateEventPayload) => Promise<void>;
  eventToEdit?: EventItem | null;
  categories: Category[];
}

export const EventFormModal: React.FC<EventFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  eventToEdit,
  categories,
}) => {
  const [formData, setFormData] = useState<CreateEventPayload>({
    title: '',
    description: '',
    image: '',
    date: '',
    time: '20:00',
    location: 'Santa Cruz',
    address: '',
    price: 50,
    capacity: 500,
    categoryId: categories[0]?.id || 1,
    status: 'PUBLICADO',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Estados para selección y subida de imagen
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imageError, setImageError] = useState<string | null>(null);
  const [useUrlMode, setUseUrlMode] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (eventToEdit) {
      setFormData({
        title: eventToEdit.title,
        description: eventToEdit.description,
        image: eventToEdit.image || '',
        date: eventToEdit.date.substring(0, 10),
        time: eventToEdit.time,
        location: eventToEdit.location,
        address: eventToEdit.address,
        price: eventToEdit.price,
        capacity: eventToEdit.capacity,
        categoryId: eventToEdit.categoryId,
        status: eventToEdit.status,
      });
    } else {
      setFormData({
        title: '',
        description: '',
        image: '',
        date: new Date().toISOString().substring(0, 10),
        time: '20:00',
        location: 'Santa Cruz',
        address: '',
        price: 50,
        capacity: 500,
        categoryId: categories[0]?.id || 1,
        status: 'PUBLICADO',
      });
    }
    setError(null);
    setImageError(null);
    setUseUrlMode(false);
  }, [eventToEdit, isOpen, categories]);

  const handleFileUpload = async (file: File) => {
    setImageError(null);

    if (!file.type.startsWith('image/')) {
      setImageError('Solo se admiten archivos de imagen (JPEG, PNG, WEBP, GIF).');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setImageError('La imagen seleccionada supera el límite de 10 MB.');
      return;
    }

    try {
      setUploadingImage(true);
      const uploadedUrl = await uploadService.uploadImage(file);
      setFormData((prev) => ({ ...prev, image: uploadedUrl }));
    } catch (err: any) {
      setImageError(err.response?.data?.message || 'Error al subir la imagen al servidor.');
    } finally {
      setUploadingImage(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleRemoveImage = () => {
    setFormData((prev) => ({ ...prev, image: '' }));
    setImageError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.title || !formData.description || !formData.date || !formData.address) {
      setError('Por favor completa todos los campos obligatorios.');
      return;
    }

    try {
      setLoading(true);
      await onSubmit(formData);
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al guardar el evento.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={eventToEdit ? 'Editar Evento' : 'Crear Nuevo Evento'}
      maxWidth="xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-xl text-xs">
            {error}
          </div>
        )}

        <Input
          label="Título del Evento"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="Ej. Festival de Música 2026"
          required
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
              Categoría
            </label>
            <select
              value={formData.categoryId}
              onChange={(e) => setFormData({ ...formData, categoryId: Number(e.target.value) })}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-brand-500"
            >
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
              Estado
            </label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-brand-500"
            >
              <option value="PUBLICADO">PUBLICADO</option>
              <option value="BORRADOR">BORRADOR</option>
              <option value="FINALIZADO">FINALIZADO</option>
              <option value="CANCELADO">CANCELADO</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
            Descripción Detallada
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={3}
            placeholder="Detalles sobre artistas, horarios de ingreso, accesos y normas del evento..."
            className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-brand-500"
            required
          />
        </div>

        {/* Sección de Imagen del Evento: Selector desde la computadora */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
              Imagen de Portada
            </label>
            <button
              type="button"
              onClick={() => setUseUrlMode(!useUrlMode)}
              className="text-xs text-brand-400 hover:text-brand-300 flex items-center gap-1 transition-colors"
            >
              {useUrlMode ? (
                <>
                  <Upload className="w-3.5 h-3.5" />
                  <span>Seleccionar archivo de computadora</span>
                </>
              ) : (
                <>
                  <Link2 className="w-3.5 h-3.5" />
                  <span>Ingresar URL web</span>
                </>
              )}
            </button>
          </div>

          {imageError && (
            <div className="p-2.5 mb-2 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-xl text-xs flex items-center justify-between">
              <span>{imageError}</span>
              <button
                type="button"
                onClick={() => setImageError(null)}
                className="text-rose-400 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {useUrlMode ? (
            <div className="space-y-2">
              <Input
                value={formData.image || ''}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                placeholder="https://images.unsplash.com/..."
              />
              {formData.image && (
                <div className="relative h-36 rounded-xl overflow-hidden border border-slate-800 bg-slate-950">
                  <img
                    src={getImageUrl(formData.image)}
                    alt="Vista previa de portada"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>
          ) : (
            <div>
              {/* Input de archivo oculto */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
                onChange={handleFileChange}
                className="hidden"
              />

              {formData.image ? (
                <div className="relative rounded-2xl overflow-hidden border border-slate-700 bg-slate-950 group">
                  <div className="h-44 w-full">
                    <img
                      src={getImageUrl(formData.image)}
                      alt="Portada seleccionada"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Acciones flotantes sobre la imagen */}
                  <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 backdrop-blur-sm">
                    <button
                      type="button"
                      disabled={uploadingImage}
                      onClick={() => fileInputRef.current?.click()}
                      className="px-3.5 py-2 bg-brand-500 hover:bg-brand-600 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-lg transition-colors cursor-pointer"
                    >
                      {uploadingImage ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <RefreshCw className="w-4 h-4" />
                      )}
                      Cambiar Imagen
                    </button>
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="px-3.5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-lg transition-colors cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                      Quitar
                    </button>
                  </div>

                  {/* Botón de cambio rápido en móvil o esquina */}
                  <div className="absolute top-2 right-2 flex gap-1.5 sm:hidden">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="p-1.5 bg-slate-900/90 text-white rounded-lg border border-slate-700"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="p-1.5 bg-rose-900/90 text-white rounded-lg border border-rose-700"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ) : (
                /* Zona de arrastrar y soltar o clic para examinar */
                <div
                  onClick={() => !uploadingImage && fileInputRef.current?.click()}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`border-2 border-dashed rounded-2xl p-6 text-center transition-all cursor-pointer ${
                    isDragging
                      ? 'border-brand-500 bg-brand-500/10'
                      : 'border-slate-800 hover:border-slate-700 bg-slate-900/50 hover:bg-slate-900'
                  }`}
                >
                  {uploadingImage ? (
                    <div className="flex flex-col items-center justify-center py-4 space-y-2">
                      <Loader2 className="w-8 h-8 text-brand-400 animate-spin" />
                      <span className="text-sm font-medium text-slate-300">
                        Subiendo imagen desde tu computadora...
                      </span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center space-y-2">
                      <div className="p-3 bg-brand-500/10 text-brand-400 rounded-2xl border border-brand-500/20">
                        <Upload className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-200">
                          Seleccionar imagen de tu computadora
                        </p>
                        <p className="text-xs text-slate-400 mt-0.5">
                          Haz clic aquí o arrastra y suelta tu archivo (PNG, JPG, WEBP)
                        </p>
                      </div>
                      <span className="text-[11px] text-slate-500 font-mono">
                        Máximo recomendado: 10 MB
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Fecha del Evento"
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            required
          />
          <Input
            label="Hora de Inicio"
            type="time"
            value={formData.time}
            onChange={(e) => setFormData({ ...formData, time: e.target.value })}
            required
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Ciudad / Región"
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            placeholder="Ej. Santa Cruz, Tarija, etc."
            required
          />
          <Input
            label="Dirección / Recinto"
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            placeholder="Ej. Estadio Ramón Tahuichi Aguilera"
            required
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Precio por Entrada (Bs.)"
            type="number"
            min="0"
            step="1"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
            required
          />
          <Input
            label="Capacidad / Aforo Total"
            type="number"
            min="1"
            value={formData.capacity}
            onChange={(e) => setFormData({ ...formData, capacity: Number(e.target.value) })}
            required
          />
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" isLoading={loading || uploadingImage}>
            {eventToEdit ? 'Guardar Cambios' : 'Publicar Evento'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
