import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { authService } from '../../services/auth.service';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { Sparkles, Mail, Lock, KeyRound, CheckCircle } from 'lucide-react';

export const LoginView: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Modal de recuperación de contraseña
  const [forgotModalOpen, setForgotModalOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSuccess, setForgotSuccess] = useState<string | null>(null);
  const [forgotError, setForgotError] = useState<string | null>(null);
  const [resetTokenInfo, setResetTokenInfo] = useState<string | null>(null);

  const { login, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const redirectPath = (location.state as any)?.from?.pathname || null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      await login({ email, password });

      const savedUserStr = localStorage.getItem('eventhub_user');
      const savedUser = savedUserStr ? JSON.parse(savedUserStr) : null;
      const role = savedUser?.role?.toUpperCase();

      if (redirectPath) {
        navigate(redirectPath, { replace: true });
      } else if (role === 'ADMIN') {
        navigate('/admin/dashboard', { replace: true });
      } else if (role === 'ORGANIZADOR') {
        navigate('/organizador/dashboard', { replace: true });
      } else {
        navigate('/usuario/dashboard', { replace: true });
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al iniciar sesión. Comprueba tus credenciales.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotError(null);
    setForgotSuccess(null);

    try {
      const res = await authService.forgotPassword(forgotEmail);
      setForgotSuccess(res.message);
      if (res.resetToken) {
        setResetTokenInfo(res.resetToken);
      }
    } catch (err: any) {
      setForgotError(err.response?.data?.message || 'Error al solicitar recuperación.');
    }
  };

  // Botones de autocompletado rápido para pruebas
  const fillCredentials = (userEmail: string, userPass: string) => {
    setEmail(userEmail);
    setPassword(userPass);
    setError(null);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        {/* Cabecera del formulario */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-brand-500/10 text-brand-400 mb-2 border border-brand-500/20">
            <Sparkles className="w-6 h-6" />
          </div>
          <h2 className="text-3xl font-black text-white">Bienvenido de nuevo</h2>
          <p className="text-xs text-slate-400">
            Inicia sesión para gestionar tus eventos o acceder a tus entradas digitales.
          </p>
        </div>

        {/* Tarjeta de Inicio de Sesión */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
          {error && (
            <div className="p-3.5 bg-rose-500/10 border border-rose-500/25 rounded-2xl text-xs text-rose-400">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Correo Electrónico"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@correo.com"
              required
              leftIcon={<Mail className="w-4 h-4" />}
            />

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
                  Contraseña
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setForgotEmail(email);
                    setForgotModalOpen(true);
                  }}
                  className="text-xs text-brand-400 hover:text-brand-300 font-medium"
                >
                  ¿Olvidaste tu contraseña?
                </button>
              </div>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                leftIcon={<Lock className="w-4 h-4" />}
              />
            </div>

            <Button type="submit" isLoading={isLoading} className="w-full mt-2" size="lg">
              Iniciar Sesión
            </Button>
          </form>

          {/* Accesos rápidos de prueba académica */}
          <div className="pt-4 border-t border-slate-800/80 space-y-2">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500 text-center">
              Acceso rápido para demostración
            </p>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => fillCredentials('admin@eventhub.com', 'Admin123!')}
                className="px-2.5 py-2 text-xs rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 font-medium transition-all"
              >
                👑 Admin
              </button>
              <button
                type="button"
                onClick={() => fillCredentials('organizador@eventhub.com', 'Organizador123!')}
                className="px-2.5 py-2 text-xs rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 font-medium transition-all"
              >
                🎪 Organizador
              </button>
              <button
                type="button"
                onClick={() => fillCredentials('usuario@eventhub.com', 'Usuario123!')}
                className="px-2.5 py-2 text-xs rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 font-medium transition-all"
              >
                🎟️ Usuario
              </button>
            </div>
          </div>
        </div>

        {/* Enlace a Registro */}
        <p className="text-center text-xs text-slate-400">
          ¿No tienes una cuenta en EventHub?{' '}
          <Link to="/registro" className="text-brand-400 font-bold hover:text-brand-300 underline">
            Regístrate aquí
          </Link>
        </p>
      </div>

      {/* Modal de Recuperación de Contraseña (RF03) */}
      <Modal
        isOpen={forgotModalOpen}
        onClose={() => {
          setForgotModalOpen(false);
          setForgotSuccess(null);
          setForgotError(null);
          setResetTokenInfo(null);
        }}
        title="Recuperar Contraseña"
      >
        <form onSubmit={handleForgotSubmit} className="space-y-4">
          <p className="text-xs text-slate-400">
            Ingresa tu correo electrónico registrado y te proporcionaremos las instrucciones para restablecer tu clave.
          </p>

          {forgotError && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-xl text-xs">
              {forgotError}
            </div>
          )}

          {forgotSuccess && (
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl text-xs flex items-start gap-2">
              <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <div>
                <p>{forgotSuccess}</p>
                {resetTokenInfo && (
                  <p className="mt-2 font-mono text-[11px] text-brand-300 break-all bg-slate-950 p-2 rounded-lg border border-slate-800">
                    Token generado: {resetTokenInfo}
                  </p>
                )}
              </div>
            </div>
          )}

          <Input
            label="Correo Registrado"
            type="email"
            value={forgotEmail}
            onChange={(e) => setForgotEmail(e.target.value)}
            placeholder="tu@correo.com"
            required
            leftIcon={<Mail className="w-4 h-4" />}
          />

          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setForgotModalOpen(false)}
            >
              Cerrar
            </Button>
            <Button type="submit" size="sm">
              Enviar Solicitud
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
