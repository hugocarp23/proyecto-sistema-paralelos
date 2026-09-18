import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { Sparkles, Mail, Lock, User, CheckCircle2 } from 'lucide-react';

export const RegisterView: React.FC = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [roleId, setRoleId] = useState<number>(3); // 3: USUARIO, 2: ORGANIZADOR
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    setIsLoading(true);
    try {
      await register({
        firstName,
        lastName,
        email,
        password,
        confirmPassword,
        roleId,
      });

      if (roleId === 2) {
        navigate('/organizador/dashboard', { replace: true });
      } else {
        navigate('/usuario/dashboard', { replace: true });
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al registrar la cuenta. Por favor verifica tus datos.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg space-y-6">
        {/* Encabezado */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-brand-500/10 text-brand-400 mb-2 border border-brand-500/20">
            <Sparkles className="w-6 h-6" />
          </div>
          <h2 className="text-3xl font-black text-white">Crea tu cuenta</h2>
          <p className="text-xs text-slate-400">
            Únete a EventHub para comprar entradas digitales o publicar tus propios eventos.
          </p>
        </div>

        {/* Tarjeta de Registro */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
          {error && (
            <div className="p-3.5 bg-rose-500/10 border border-rose-500/25 rounded-2xl text-xs text-rose-400">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Nombre"
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Juan"
                required
                leftIcon={<User className="w-4 h-4" />}
              />
              <Input
                label="Apellido"
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Pérez"
                required
              />
            </div>

            <Input
              label="Correo Electrónico"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="juan.perez@ejemplo.com"
              required
              leftIcon={<Mail className="w-4 h-4" />}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Contraseña"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mínimo 6 caracteres"
                required
                leftIcon={<Lock className="w-4 h-4" />}
              />
              <Input
                label="Confirmar Contraseña"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repite la contraseña"
                required
                leftIcon={<Lock className="w-4 h-4" />}
              />
            </div>

            {/* Selector de Tipo de Cuenta / Rol */}
            <div className="space-y-2 pt-1">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
                ¿Qué deseas hacer en EventHub?
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setRoleId(3)}
                  className={`p-3.5 rounded-2xl border text-left transition-all ${
                    roleId === 3
                      ? 'bg-brand-600/15 border-brand-500 text-white shadow-sm'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <p className="text-xs font-bold text-slate-100 flex items-center justify-between">
                    <span>🎟️ Comprar Entradas</span>
                    {roleId === 3 && <CheckCircle2 className="w-3.5 h-3.5 text-brand-400" />}
                  </p>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Cuenta de usuario general
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setRoleId(2)}
                  className={`p-3.5 rounded-2xl border text-left transition-all ${
                    roleId === 2
                      ? 'bg-brand-600/15 border-brand-500 text-white shadow-sm'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <p className="text-xs font-bold text-slate-100 flex items-center justify-between">
                    <span>🎪 Organizar Eventos</span>
                    {roleId === 2 && <CheckCircle2 className="w-3.5 h-3.5 text-brand-400" />}
                  </p>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Publicar eventos y validar QR
                  </p>
                </button>
              </div>
            </div>

            <Button type="submit" isLoading={isLoading} className="w-full mt-4" size="lg">
              Registrarme en EventHub
            </Button>
          </form>
        </div>

        {/* Enlace a Login */}
        <p className="text-center text-xs text-slate-400">
          ¿Ya tienes una cuenta registrada?{' '}
          <Link to="/login" className="text-brand-400 font-bold hover:text-brand-300 underline">
            Inicia sesión aquí
          </Link>
        </p>
      </div>
    </div>
  );
};
