import crypto from 'crypto';

/**
 * Genera un token único y seguro para códigos QR.
 * Este token no contiene datos sensibles en texto plano.
 */
export function generateSecureQrToken(): string {
  const randomBytes = crypto.randomBytes(24).toString('hex');
  return `EVH-TK-${randomBytes}`;
}

/**
 * Genera un número de ticket corto legible (ej. EVH-2026-98124)
 */
export function generateTicketNumber(): string {
  const currentYear = new Date().getFullYear();
  const randomNum = Math.floor(10000 + Math.random() * 90000);
  return `EVH-${currentYear}-${randomNum}`;
}
