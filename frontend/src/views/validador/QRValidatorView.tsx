import React, { useState } from 'react';
import { qrService } from '../../services/qr.service';
import { QrValidationResponse } from '../../interfaces/ticket';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Badge } from '../../components/common/Badge';
import {
  QrCode,
  Camera,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  History,
  User,
  Calendar,
  Clock,
  MapPin,
  Sparkles,
} from 'lucide-react';

export const QRValidatorView: React.FC = () => {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [validationResult, setValidationResult] = useState<QrValidationResponse | null>(null);
  const [history, setHistory] = useState<QrValidationResponse[]>([]);
  const [cameraActive, setCameraActive] = useState(false);

  const handleValidate = async (tokenToTest?: string) => {
    const targetCode = (tokenToTest || code).trim();
    if (!targetCode) return;

    try {
      setLoading(true);
      const res = await qrService.validate(targetCode);
      setValidationResult(res);
      setHistory((prev) => [res, ...prev.slice(0, 9)]);
      if (!tokenToTest) {
        setCode('');
      }
    } catch (err: any) {
      const errorRes: QrValidationResponse = {
        status: 'fail',
        valid: false,
        message: err.response?.data?.message || 'Error de comunicación al validar el código.',
      };
      setValidationResult(errorRes);
      setHistory((prev) => [errorRes, ...prev.slice(0, 9)]);
    } finally {
      setLoading(false);
    }
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleValidate();
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Cabecera del Validador */}
      <div className="pb-6 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-300 text-xs font-bold uppercase tracking-wider mb-2">
            <QrCode className="w-3.5 h-3.5" />
            <span>Módulo de Control de Acceso</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">Validación de Códigos QR</h1>
          <p className="text-xs text-slate-400 mt-1">
            Escanea o ingresa el código del ticket para comprobar su autenticidad y registrar asistencia
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Columna Izquierda: Métodos de Escaneo e Ingreso */}
        <div className="space-y-6">
          {/* Ingreso Manual de Código */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-md">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <QrCode className="w-5 h-5 text-brand-400" />
              <span>Ingreso por Código o Token</span>
            </h3>
            <p className="text-xs text-slate-400">
              Ingresa el número de ticket (ej. EVH-2026-XXXXX) o el token generado por el lector de código de barras / QR.
            </p>

            <form onSubmit={handleManualSubmit} className="space-y-3">
              <Input
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="EVH-2026-... o EVH-TK-..."
                required
                className="text-base font-mono"
                autoFocus
              />
              <Button type="submit" isLoading={loading} className="w-full" size="md">
                Validar Entrada
              </Button>
            </form>
          </div>

          {/* Opción Lector de Cámara */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-md">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Camera className="w-5 h-5 text-purple-400" />
                <span>Lector de Cámara del Dispositivo</span>
              </h3>
              <Button
                variant={cameraActive ? 'danger' : 'secondary'}
                size="sm"
                onClick={() => setCameraActive(!cameraActive)}
              >
                {cameraActive ? 'Desactivar' : 'Activar Cámara'}
              </Button>
            </div>

            {cameraActive ? (
              <div className="p-8 bg-slate-950 border border-dashed border-purple-500/50 rounded-2xl text-center space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-400 flex items-center justify-center mx-auto animate-pulse">
                  <Camera className="w-6 h-6" />
                </div>
                <p className="text-xs text-slate-300 font-semibold">
                  Apunta la cámara del teléfono hacia el código QR
                </p>
                <p className="text-[11px] text-slate-500 max-w-xs mx-auto">
                  Si tu navegador solicita permisos de cámara, acepta para habilitar el reconocimiento automático.
                </p>
              </div>
            ) : (
              <p className="text-xs text-slate-400">
                Puedes conectar un escáner óptico USB/Bluetooth directamente a tu ordenador, o utilizar la cámara frontal de tu tablet o smartphone.
              </p>
            )}
          </div>
        </div>

        {/* Columna Derecha: Resultado Instantáneo de Validación */}
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
            <h3 className="text-base font-bold text-white">Resultado de Validación</h3>

            {validationResult ? (
              <div
                className={`p-6 rounded-2xl border transition-all ${
                  validationResult.valid
                    ? 'bg-emerald-950/30 border-emerald-500/50 text-emerald-300'
                    : 'bg-rose-950/30 border-rose-500/50 text-rose-300'
                }`}
              >
                <div className="flex items-start gap-4">
                  {validationResult.valid ? (
                    <CheckCircle2 className="w-10 h-10 text-emerald-400 flex-shrink-0 mt-0.5" />
                  ) : (
                    <XCircle className="w-10 h-10 text-rose-400 flex-shrink-0 mt-0.5" />
                  )}

                  <div className="space-y-2 flex-1">
                    <span
                      className={`text-xs font-black uppercase tracking-wider px-2.5 py-1 rounded-full ${
                        validationResult.valid
                          ? 'bg-emerald-500/20 text-emerald-300'
                          : 'bg-rose-500/20 text-rose-300'
                      }`}
                    >
                      {validationResult.valid ? '✓ ACCESO PERMITIDO' : '✕ ACCESO DENEGADO'}
                    </span>

                    <p className="text-sm font-bold text-slate-100 leading-snug">
                      {validationResult.message}
                    </p>

                    {validationResult.ticket && (
                      <div className="mt-3 pt-3 border-t border-slate-800/80 space-y-1.5 text-xs text-slate-300">
                        <p>
                          <strong className="text-white">Evento:</strong> {validationResult.ticket.event?.title}
                        </p>
                        <p>
                          <strong className="text-white">Asistente:</strong> {validationResult.ticket.user?.firstName} {validationResult.ticket.user?.lastName} ({validationResult.ticket.user?.email})
                        </p>
                        <p>
                          <strong className="text-white">Ticket N°:</strong> <span className="font-mono">{validationResult.ticket.ticketNumber}</span>
                        </p>
                        {validationResult.attendance && (
                          <p className="text-emerald-400 font-semibold pt-1">
                            Hora de ingreso: {new Date(validationResult.attendance.validatedAt).toLocaleTimeString('es-BO')} (Validado por {validationResult.attendance.validatorName})
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-8 text-center text-slate-500 bg-slate-950 rounded-2xl border border-slate-800/60">
                <QrCode className="w-8 h-8 mx-auto mb-2 opacity-40 text-brand-400" />
                <p className="text-xs">Esperando escaneo o ingreso de código...</p>
              </div>
            )}
          </div>

          {/* Historial Reciente de la Sesión de Puerta */}
          {history.length > 0 && (
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <History className="w-4 h-4" />
                <span>Últimos {history.length} accesos validados</span>
              </h4>

              <div className="space-y-2">
                {history.map((h, i) => (
                  <div
                    key={i}
                    className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      {h.valid ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                      ) : (
                        <XCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
                      )}
                      <span className="truncate text-slate-300">
                        {h.ticket?.user ? `${h.ticket.user.firstName} ${h.ticket.user.lastName}` : h.message}
                      </span>
                    </div>
                    <Badge variant={h.valid ? 'success' : 'danger'} size="sm">
                      {h.valid ? 'Válido' : 'Rechazado'}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
