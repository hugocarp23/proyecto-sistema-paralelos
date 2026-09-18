import React from 'react';
import { QRCodeSVG } from 'qrcode.react';

interface QRCodeDisplayProps {
  value: string;
  size?: number;
  className?: string;
}

export const QRCodeDisplay: React.FC<QRCodeDisplayProps> = ({
  value,
  size = 200,
  className = '',
}) => {
  return (
    <div
      className={`inline-flex flex-col items-center justify-center p-4 bg-white rounded-2xl shadow-xl ${className}`}
    >
      <QRCodeSVG
        value={value}
        size={size}
        level="H"
        includeMargin={false}
        bgColor="#ffffff"
        fgColor="#0f172a"
      />
    </div>
  );
};
