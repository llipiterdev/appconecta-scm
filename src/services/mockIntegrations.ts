/**
 * Adaptadores que simulan los sistemas corporativos con los que AppConecta se integra:
 * gestion documental, nomina, Recursos Humanos y directorio de colaboradores.
 *
 * Ninguno de estos sistemas existe. Todos los datos son ficticios.
 *
 * Las respuestas conservan deliberadamente la forma cruda que tendrian los sistemas
 * corporativos heredados: claves en espanol, `snake_case`, importes como cadena, fechas en
 * formato `DD/MM/YYYY` y codigos de estado numericos. Es una decision de diseno del simulacro
 * (ver `docs/adr/0001-simulation-scope.md`), no un defecto.
 *
 * TD-008 (registrada en docs/technical-debt-register.md) documentaba que ningun adaptador
 * traducia este contrato al modelo de dominio. Desde la intervencion de la Actividad 4, los
 * unicos modulos que conocen estas claves son los adaptadores de `src/adapters/*Adapter.ts`;
 * el resto del dominio solo ve los tipos de `src/types/domain.ts`.
 */

const DEFAULT_LATENCY_MS = 400;

function latency(): number {
  const configured = Number(import.meta.env.VITE_MOCK_LATENCY_MS);

  return Number.isFinite(configured) && configured >= 0 ? configured : DEFAULT_LATENCY_MS;
}

function delayed<T>(payload: T): Promise<T> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(payload), latency());
  });
}

export type DirectoryApiResponse = {
  codigo_respuesta: number;
  empleado: {
    cod_empleado: string;
    nombre_completo: string;
    num_documento: string;
    cargo: string;
    area: string;
    centro_costo: string;
    sede: string;
    fecha_ingreso: string;
    tipo_contrato: string;
    correo_corporativo: string;
    telefono_movil: string;
    jefe_inmediato: string;
    estado_carne: number;
  };
};

export type DocumentApiResponse = {
  codigo_respuesta: number;
  documentos: Array<{
    cod_documento: string;
    nombre_documento: string;
    tipo_documento: string;
    fecha_emision: string;
    tamano_bytes: number;
    formato: string;
  }>;
};

export type PayrollApiResponse = {
  codigo_respuesta: number;
  desprendibles: Array<{
    cod_desprendible: string;
    periodo_inicio: string;
    periodo_fin: string;
    valor_devengado: string;
    valor_deducciones: string;
    fecha_pago: string;
  }>;
};

export type AnnouncementApiResponse = {
  codigo_respuesta: number;
  publicaciones: Array<{
    cod_publicacion: string;
    titulo: string;
    resumen: string;
    categoria: string;
    fecha_publicacion: string;
    destacado: number;
  }>;
};

export function fetchEmployeeDirectory(): Promise<DirectoryApiResponse> {
  return delayed({
    codigo_respuesta: 200,
    empleado: {
      cod_empleado: 'EMP-004821',
      nombre_completo: 'Laura Catalina Restrepo Mejia',
      num_documento: '1.024.887.331',
      cargo: 'Analista de Operaciones Senior',
      area: 'Operaciones Nacionales',
      centro_costo: 'CC-2140',
      sede: 'Bogota — Sede Norte',
      fecha_ingreso: '14/03/2019',
      tipo_contrato: 'Termino indefinido',
      correo_corporativo: 'laura.restrepo@appconecta-demo.co',
      telefono_movil: '+57 310 000 0000',
      jefe_inmediato: 'Andres Felipe Quintero',
      estado_carne: 1,
    },
  });
}

export function fetchLaborDocuments(): Promise<DocumentApiResponse> {
  return delayed({
    codigo_respuesta: 200,
    documentos: [
      {
        cod_documento: 'DOC-99120',
        nombre_documento: 'Contrato de trabajo a termino indefinido',
        tipo_documento: 'CONTRATO',
        fecha_emision: '14/03/2019',
        tamano_bytes: 284_160,
        formato: 'PDF',
      },
      {
        cod_documento: 'DOC-99121',
        nombre_documento: 'Otrosi de modificacion salarial',
        tipo_documento: 'ANEXO',
        fecha_emision: '01/02/2024',
        tamano_bytes: 118_784,
        formato: 'PDF',
      },
      {
        cod_documento: 'DOC-99122',
        nombre_documento: 'Certificacion laboral vigente',
        tipo_documento: 'CERTIFICACION',
        fecha_emision: '05/06/2026',
        tamano_bytes: 96_256,
        formato: 'PDF',
      },
      {
        cod_documento: 'DOC-99123',
        nombre_documento: 'Politica de tratamiento de datos personales',
        tipo_documento: 'POLITICA',
        fecha_emision: '20/01/2025',
        tamano_bytes: 512_000,
        formato: 'PDF',
      },
      {
        cod_documento: 'DOC-99124',
        nombre_documento: 'Anexo de teletrabajo suplementario',
        tipo_documento: 'ANEXO',
        fecha_emision: '11/09/2025',
        tamano_bytes: 143_360,
        formato: 'PDF',
      },
    ],
  });
}

export function fetchPayslips(): Promise<PayrollApiResponse> {
  return delayed({
    codigo_respuesta: 200,
    desprendibles: [
      {
        cod_desprendible: 'NOM-2026-08-Q1',
        periodo_inicio: '01/08/2026',
        periodo_fin: '15/08/2026',
        valor_devengado: '4850000',
        valor_deducciones: '742300',
        fecha_pago: '15/08/2026',
      },
      {
        cod_desprendible: 'NOM-2026-07-Q2',
        periodo_inicio: '16/07/2026',
        periodo_fin: '31/07/2026',
        valor_devengado: '4850000',
        valor_deducciones: '742300',
        fecha_pago: '31/07/2026',
      },
      {
        cod_desprendible: 'NOM-2026-07-Q1',
        periodo_inicio: '01/07/2026',
        periodo_fin: '15/07/2026',
        valor_devengado: '5120000',
        valor_deducciones: '798400',
        fecha_pago: '15/07/2026',
      },
      {
        cod_desprendible: 'NOM-2026-06-Q2',
        periodo_inicio: '16/06/2026',
        periodo_fin: '30/06/2026',
        valor_devengado: '4850000',
        valor_deducciones: '742300',
        fecha_pago: '30/06/2026',
      },
      {
        cod_desprendible: 'NOM-2026-06-Q1',
        periodo_inicio: '01/06/2026',
        periodo_fin: '15/06/2026',
        valor_devengado: '4850000',
        valor_deducciones: '742300',
        fecha_pago: '15/06/2026',
      },
      {
        cod_desprendible: 'NOM-2026-05-Q2',
        periodo_inicio: '16/05/2026',
        periodo_fin: '31/05/2026',
        valor_devengado: '4850000',
        valor_deducciones: '742300',
        fecha_pago: '31/05/2026',
      },
    ],
  });
}

export function fetchAnnouncements(): Promise<AnnouncementApiResponse> {
  return delayed({
    codigo_respuesta: 200,
    publicaciones: [
      {
        cod_publicacion: 'PUB-5501',
        titulo: 'Nueva jornada de bienestar en la sede norte',
        resumen:
          'Durante la ultima semana del mes se habilitan jornadas de salud preventiva y actividad fisica dirigida para todas las areas.',
        categoria: 'BIENESTAR',
        fecha_publicacion: '18/08/2026',
        destacado: 1,
      },
      {
        cod_publicacion: 'PUB-5500',
        titulo: 'Reconocimiento al equipo de Operaciones Nacionales',
        resumen:
          'El equipo cerro el trimestre con el mejor indicador de cumplimiento operativo del ultimo ano.',
        categoria: 'RECONOCIMIENTO',
        fecha_publicacion: '12/08/2026',
        destacado: 0,
      },
      {
        cod_publicacion: 'PUB-5499',
        titulo: 'Ajuste en el horario de la mesa de ayuda',
        resumen:
          'La mesa de ayuda atendera de 7:00 a 19:00 en dias habiles. Las solicitudes fuera de ese horario quedan en cola.',
        categoria: 'OPERACIONES',
        fecha_publicacion: '05/08/2026',
        destacado: 0,
      },
      {
        cod_publicacion: 'PUB-5498',
        titulo: 'Actualizacion del portal del colaborador',
        resumen:
          'El portal incorpora la consulta de desprendibles y el registro de incapacidades desde el movil.',
        categoria: 'TECNOLOGIA',
        fecha_publicacion: '28/07/2026',
        destacado: 0,
      },
    ],
  });
}
