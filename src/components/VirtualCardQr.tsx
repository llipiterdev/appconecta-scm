import { useEffect, useState } from 'react';
import QRCode from 'qrcode';

type VirtualCardQrProps = {
  payload: string;
  /** Descripcion para lectores de pantalla. Un QR sin alternativa textual es inaccesible. */
  alt: string;
};

type QrState = { source: string } | { error: string } | undefined;

/**
 * Renderiza el QR como SVG incrustado en un `img`.
 *
 * Se genera SVG y no un canvas por dos razones: el resultado es nitido a cualquier tamano y no
 * depende de una API del navegador que jsdom no implementa, de modo que las pruebas de componente
 * verifican el mismo codigo que se ejecuta en produccion.
 */
export function VirtualCardQr({ payload, alt }: VirtualCardQrProps) {
  const [state, setState] = useState<QrState>(undefined);

  useEffect(() => {
    let active = true;

    QRCode.toString(payload, { type: 'svg', margin: 1, errorCorrectionLevel: 'M' })
      .then((svg) => {
        if (active) {
          setState({ source: `data:image/svg+xml;utf8,${encodeURIComponent(svg)}` });
        }
      })
      .catch(() => {
        if (active) {
          setState({ error: 'No fue posible generar el codigo QR del carne.' });
        }
      });

    return () => {
      active = false;
    };
  }, [payload]);

  if (state === undefined) {
    return (
      <div
        className="size-44 animate-pulse rounded-lg bg-slate-200"
        role="status"
        aria-label="Generando el codigo QR del carne"
      />
    );
  }

  if ('error' in state) {
    return (
      <p className="size-44 content-center rounded-lg bg-red-50 p-4 text-center text-sm text-red-800">
        {state.error}
      </p>
    );
  }

  return <img src={state.source} alt={alt} className="size-44 rounded-lg bg-white p-2" />;
}
