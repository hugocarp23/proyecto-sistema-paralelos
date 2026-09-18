import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { userService } from '../../services/user.service';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { User as UserIcon, Mail, Lock, CheckCircle2 } from 'lucide-react';

export const UserProfileView: React.FC = () => {
  const { user, refreshUser } = useAuth();
  const [firstName, setFirstName] = useState(user?.firstName || '');
  const [lastName, setLastName] = useState(user?.lastName || '');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (newPassword && newPassword !== confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    try {
      setLoading(true);
      await userService.updateProfile({
        firstName,
        lastName,
        password: newPassword || undefined,
      });
      await refreshUser();
      setSuccess('Perfil actualizado correctamente.');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al actualizar el perfil.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl space-y-6">
      <div className="pb-4 border-b border-slate-800">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <UserIcon className="w-5 h-5 text-brand-400" />
          <span>Mi Perfil de Usuario</span>
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Actualiza tus datos personales y configuración de seguridad
        </p>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-md space-y-6">
        {success && (
          <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/25 rounded-xl text-xs text-emerald-400 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
            <span>{success}</span>
          </div>
        )}

        {error && (
          <div className="p-3.5 bg-rose-500/10 border border-rose-500/25 rounded-xl text-xs text-rose-400">
            {error}
          </div>
        )}

        <div className="flex items-center gap-4 pb-4 border-b border-slate-800">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-brand-600 to-purple-500 flex items-center justify-center font-black text-lg text-white shadow-md">
            {user?.firstName?.[0]}
          </div>
          <div>
            <h3 className="text-base font-bold text-white">{user?.firstName} {user?.lastName}</h3>
            <p className="text-xs text-slate-400">{user?.email}</p>
            <div className="mt-1.5">
              <Badge variant="primary" size="sm">
                Rol: {user?.role}
              </Badge>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Nombre"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
            <Input
              label="Apellido"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
          </div>

          <Input
            label="Correo Electrónico (No editable)"
            value={user?.email || ''}
            disabled
            className="opacity-60 cursor-not-allowed"
            leftIcon={<Mail className="w-4 h-4" />}
          />

          <div className="pt-4 border-t border-slate-800 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Cambiar Contraseña (Opcional)
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Nueva Contraseña"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••"
                leftIcon={<Lock className="w-4 h-4" />}
              />
              <Input
                label="Confirmar Nueva Contraseña"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                leftIcon={<Lock className="w-4 h-4" />}
              />
            </div>
          </div>

          <div className="pt-4">
            <Button type="submit" isLoading={loading} className="w-full sm:w-auto px-8">
              Guardar Cambios
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
