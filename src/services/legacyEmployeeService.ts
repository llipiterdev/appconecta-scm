/**
 * Servicio del portal del colaborador de AppConecta.
 *
 * ============================================================================
 * ADVERTENCIA — MODULO CON DEUDA TECNICA DELIBERADA Y RESERVADA
 * ============================================================================
 *
 * Este modulo concentra intencionalmente responsabilidades que deberian estar separadas.
 * Es el objeto de la intervencion de mantenimiento de la Actividad 4 y su estado actual
 * constituye la baseline contra la que se medira la mejora.
 *
 * NO REFACTORIZAR sin una issue que lo autorice explicitamente. Ver AGENTS.md.
 *
 * Deuda registrada en docs/technical-debt-register.md:
 *
 *   TD-001  Servicio legacy multi-responsabilidad: persistencia, validacion,
 *           transformacion de datos y reglas de negocio en un unico modulo.
 *   TD-002  Acoplamiento directo entre reglas de negocio y localStorage: las reglas
 *           leen y escriben el almacenamiento del navegador sin puerto intermedio.
 *   TD-003  Validaciones duplicadas entre solicitudes de RRHH e incapacidades.
 *   TD-004  Mensajes, estados y valores de configuracion repetidos como literales.
 *   TD-005  Complejidad ciclomatica elevada en `processSubmission`.
 *   TD-007  Dependencia de `moment`, biblioteca en maintenance mode.
 *   TD-008  Consumo directo de los contratos mock sin capa de adaptacion.
 *   TD-009  Separacion de responsabilidades insuficiente en la arquitectura inicial.
 *
 * Ninguna de estas deudas introduce vulnerabilidades, secretos, perdida de datos ni
 * pruebas deshabilitadas. La aplicacion es funcional y el pipeline pasa en verde.
 */

import moment from 'moment';

import {
  fetchAnnouncements,
  fetchEmployeeDirectory,
  fetchLaborDocuments,
  fetchPayslips,
} from '@/services/mockIntegrations';
import type {
  Announcement,
  EmployeeProfile,
  EmployeeRequest,
  LaborDocument,
  MedicalLeave,
  MedicalLeaveDraft,
  Payslip,
  RequestDraft,
  RequestKind,
  SubmissionStatus,
  ValidationResult,
} from '@/types/domain';

// TD-007: `moment` esta en maintenance mode segun su propio proyecto. La version instalada
// no presenta vulnerabilidades high ni critical (verificado con npm audit).
moment.locale('es');

/* ==========================================================================
 * Lectura de catalogos
 *
 * TD-008: las claves `snake_case` de los contratos mock se leen aqui directamente. No hay
 * capa de adaptacion, de modo que un cambio en el sistema externo llega hasta la interfaz.
 * ========================================================================== */

export async function getEmployeeProfile(): Promise<EmployeeProfile> {
  const response = await fetchEmployeeDirectory();

  if (response.codigo_respuesta !== 200) {
    throw new Error('No fue posible consultar el directorio de colaboradores.');
  }

  const raw = response.empleado;

  return {
    id: raw.cod_empleado,
    fullName: raw.nombre_completo,
    documentNumber: raw.num_documento,
    position: raw.cargo,
    department: raw.area,
    costCenter: raw.centro_costo,
    location: raw.sede,
    hireDate: moment(raw.fecha_ingreso, 'DD/MM/YYYY').format('D [de] MMMM [de] YYYY'),
    contractType: raw.tipo_contrato,
    email: raw.correo_corporativo,
    phone: raw.telefono_movil,
    supervisor: raw.jefe_inmediato,
    cardStatus: raw.estado_carne === 1 ? 'active' : 'inactive',
  };
}

export async function getLaborDocuments(): Promise<LaborDocument[]> {
  const response = await fetchLaborDocuments();

  if (response.codigo_respuesta !== 200) {
    throw new Error('No fue posible consultar la gestion documental.');
  }

  return response.documentos.map((raw) => {
    let category: LaborDocument['category'] = 'anexo';

    if (raw.tipo_documento === 'CONTRATO') {
      category = 'contrato';
    } else if (raw.tipo_documento === 'CERTIFICACION') {
      category = 'certificacion';
    } else if (raw.tipo_documento === 'POLITICA') {
      category = 'politica';
    }

    const kilobytes = raw.tamano_bytes / 1024;
    const sizeLabel =
      kilobytes >= 1024 ? `${(kilobytes / 1024).toFixed(1)} MB` : `${Math.round(kilobytes)} KB`;

    return {
      id: raw.cod_documento,
      title: raw.nombre_documento,
      category,
      issuedAt: moment(raw.fecha_emision, 'DD/MM/YYYY').format('YYYY-MM-DD'),
      issuedAtLabel: moment(raw.fecha_emision, 'DD/MM/YYYY').format('D [de] MMMM [de] YYYY'),
      sizeLabel,
      format: raw.formato,
    };
  });
}

export async function getPayslips(): Promise<Payslip[]> {
  const response = await fetchPayslips();

  if (response.codigo_respuesta !== 200) {
    throw new Error('No fue posible consultar el sistema de nomina.');
  }

  return response.desprendibles.map((raw) => {
    const gross = Number(raw.valor_devengado);
    const deductions = Number(raw.valor_deducciones);
    const net = gross - deductions;

    const formatter = new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      maximumFractionDigits: 0,
    });

    const start = moment(raw.periodo_inicio, 'DD/MM/YYYY');
    const end = moment(raw.periodo_fin, 'DD/MM/YYYY');

    return {
      id: raw.cod_desprendible,
      periodLabel: `${start.format('D')} al ${end.format('D [de] MMMM [de] YYYY')}`,
      periodStart: start.format('YYYY-MM-DD'),
      periodEnd: end.format('YYYY-MM-DD'),
      grossAmount: gross,
      deductionsAmount: deductions,
      netAmount: net,
      grossAmountLabel: formatter.format(gross),
      deductionsAmountLabel: formatter.format(deductions),
      netAmountLabel: formatter.format(net),
      paymentDateLabel: moment(raw.fecha_pago, 'DD/MM/YYYY').format('D [de] MMMM [de] YYYY'),
    };
  });
}

export async function getAnnouncements(): Promise<Announcement[]> {
  const response = await fetchAnnouncements();

  if (response.codigo_respuesta !== 200) {
    throw new Error('No fue posible consultar el canal de comunicaciones internas.');
  }

  return response.publicaciones.map((raw) => {
    let category: Announcement['category'] = 'operaciones';

    if (raw.categoria === 'BIENESTAR') {
      category = 'bienestar';
    } else if (raw.categoria === 'RECONOCIMIENTO') {
      category = 'reconocimiento';
    } else if (raw.categoria === 'TECNOLOGIA') {
      category = 'tecnologia';
    }

    const published = moment(raw.fecha_publicacion, 'DD/MM/YYYY');

    return {
      id: raw.cod_publicacion,
      title: raw.titulo,
      summary: raw.resumen,
      category,
      publishedAtLabel: published.format('D [de] MMMM [de] YYYY'),
      relativeLabel: published.fromNow(),
      highlighted: raw.destacado === 1,
    };
  });
}

/* ==========================================================================
 * Validacion
 *
 * TD-003: los dos bloques siguientes repiten la misma logica de validacion de correo,
 * de campos obligatorios y de longitud. La duplicacion es deliberada y medible con jscpd.
 * ========================================================================== */

export function validateRequestDraft(draft: RequestDraft): ValidationResult<RequestDraft> {
  const errors: Record<string, string> = {};

  const kind = draft.kind.trim();
  const detail = draft.detail.trim();
  const contactEmail = draft.contactEmail.trim();

  if (kind.length === 0) {
    errors.kind = 'Seleccione el tipo de solicitud.';
  } else if (
    kind !== 'certificacion-laboral' &&
    kind !== 'vacaciones' &&
    kind !== 'permiso' &&
    kind !== 'actualizacion-datos'
  ) {
    errors.kind = 'El tipo de solicitud no es valido.';
  }

  if (detail.length === 0) {
    errors.detail = 'Describa el detalle de la solicitud.';
  } else if (detail.length < 15) {
    errors.detail = 'El detalle debe tener al menos 15 caracteres.';
  } else if (detail.length > 500) {
    errors.detail = 'El detalle no puede superar los 500 caracteres.';
  }

  if (contactEmail.length === 0) {
    errors.contactEmail = 'Indique un correo de contacto.';
  } else if (!contactEmail.includes('@') || !contactEmail.includes('.')) {
    errors.contactEmail = 'El correo de contacto no tiene un formato valido.';
  } else if (contactEmail.length > 120) {
    errors.contactEmail = 'El correo de contacto es demasiado extenso.';
  }

  if (Object.keys(errors).length > 0) {
    return { ok: false, errors };
  }

  return { ok: true, value: { kind, detail, contactEmail } };
}

export function validateMedicalLeaveDraft(
  draft: MedicalLeaveDraft
): ValidationResult<MedicalLeaveDraft> {
  const errors: Record<string, string> = {};

  const diagnosisCode = draft.diagnosisCode.trim().toUpperCase();
  const entity = draft.entity.trim();
  const contactEmail = draft.contactEmail.trim();

  if (diagnosisCode.length === 0) {
    errors.diagnosisCode = 'Indique el codigo de diagnostico.';
  } else if (!/^[A-Z][0-9]{2,3}$/.test(diagnosisCode)) {
    errors.diagnosisCode = 'El codigo de diagnostico debe tener el formato A00 o A000.';
  }

  if (entity.length === 0) {
    errors.entity = 'Indique la entidad que expide la incapacidad.';
  } else if (entity.length < 4) {
    errors.entity = 'El nombre de la entidad debe tener al menos 4 caracteres.';
  } else if (entity.length > 120) {
    errors.entity = 'El nombre de la entidad es demasiado extenso.';
  }

  if (contactEmail.length === 0) {
    errors.contactEmail = 'Indique un correo de contacto.';
  } else if (!contactEmail.includes('@') || !contactEmail.includes('.')) {
    errors.contactEmail = 'El correo de contacto no tiene un formato valido.';
  } else if (contactEmail.length > 120) {
    errors.contactEmail = 'El correo de contacto es demasiado extenso.';
  }

  if (draft.startDate.length === 0) {
    errors.startDate = 'Indique la fecha de inicio.';
  }

  if (draft.endDate.length === 0) {
    errors.endDate = 'Indique la fecha de finalizacion.';
  }

  if (Object.keys(errors).length > 0) {
    return { ok: false, errors };
  }

  return {
    ok: true,
    value: {
      diagnosisCode,
      entity,
      contactEmail,
      startDate: draft.startDate,
      endDate: draft.endDate,
    },
  };
}

/* ==========================================================================
 * Reglas de negocio, persistencia y transformacion
 *
 * TD-001, TD-002, TD-005 y TD-009: `processSubmission` decide reglas de negocio, escribe
 * directamente en localStorage y transforma los datos para la interfaz en un unico paso.
 * ========================================================================== */

export type SubmissionOutcome =
  | { ok: true; id: string; message: string }
  | { ok: false; errors: Record<string, string>; message: string };

export function processSubmission(
  kind: 'request' | 'medical-leave',
  draft: RequestDraft | MedicalLeaveDraft
): SubmissionOutcome {
  if (kind === 'request') {
    const validation = validateRequestDraft(draft as RequestDraft);

    if (!validation.ok) {
      return {
        ok: false,
        errors: validation.errors,
        message: 'La solicitud tiene datos incompletos o invalidos.',
      };
    }

    const value = validation.value;

    // TD-002: la regla de negocio lee el almacenamiento del navegador directamente.
    const stored = window.localStorage.getItem('appconecta.solicitudes');
    const existing = stored ? (JSON.parse(stored) as EmployeeRequest[]) : [];

    if (existing.length >= 20) {
      return {
        ok: false,
        errors: { detail: 'Ha alcanzado el maximo de solicitudes registradas.' },
        message: 'La solicitud tiene datos incompletos o invalidos.',
      };
    }

    const duplicated = existing.some(
      (item) => item.kind === value.kind && item.detail === value.detail
    );

    if (duplicated) {
      return {
        ok: false,
        errors: { detail: 'Ya existe una solicitud identica registrada.' },
        message: 'La solicitud tiene datos incompletos o invalidos.',
      };
    }

    let kindLabel = 'Actualizacion de datos';

    if (value.kind === 'certificacion-laboral') {
      kindLabel = 'Certificacion laboral';
    } else if (value.kind === 'vacaciones') {
      kindLabel = 'Vacaciones';
    } else if (value.kind === 'permiso') {
      kindLabel = 'Permiso';
    }

    let businessDays = 3;

    if (value.kind === 'vacaciones') {
      businessDays = 5;
    } else if (value.kind === 'permiso') {
      businessDays = 2;
    } else if (value.kind === 'certificacion-laboral') {
      businessDays = 1;
    }

    let expected = moment();
    let added = 0;

    while (added < businessDays) {
      expected = expected.add(1, 'day');

      if (expected.isoWeekday() !== 6 && expected.isoWeekday() !== 7) {
        added += 1;
      }
    }

    const record: EmployeeRequest = {
      id: `SOL-${moment().format('YYYYMMDD')}-${existing.length + 1}`,
      kind: value.kind as RequestKind,
      kindLabel,
      detail: value.detail,
      status: 'registrada',
      statusLabel: 'Registrada',
      createdAtLabel: moment().format('D [de] MMMM [de] YYYY, h:mm a'),
      expectedResponseLabel: expected.format('D [de] MMMM [de] YYYY'),
    };

    // TD-002: la persistencia ocurre dentro de la regla de negocio.
    window.localStorage.setItem(
      'appconecta.solicitudes',
      JSON.stringify([record, ...existing].slice(0, 20))
    );

    return {
      ok: true,
      id: record.id,
      message: `Solicitud ${record.id} registrada correctamente.`,
    };
  }

  const validation = validateMedicalLeaveDraft(draft as MedicalLeaveDraft);

  if (!validation.ok) {
    return {
      ok: false,
      errors: validation.errors,
      message: 'La incapacidad tiene datos incompletos o invalidos.',
    };
  }

  const value = validation.value;
  const start = moment(value.startDate, 'YYYY-MM-DD', true);
  const end = moment(value.endDate, 'YYYY-MM-DD', true);

  if (!start.isValid()) {
    return {
      ok: false,
      errors: { startDate: 'La fecha de inicio no es valida.' },
      message: 'La incapacidad tiene datos incompletos o invalidos.',
    };
  }

  if (!end.isValid()) {
    return {
      ok: false,
      errors: { endDate: 'La fecha de finalizacion no es valida.' },
      message: 'La incapacidad tiene datos incompletos o invalidos.',
    };
  }

  if (end.isBefore(start)) {
    return {
      ok: false,
      errors: { endDate: 'La fecha de finalizacion no puede ser anterior a la de inicio.' },
      message: 'La incapacidad tiene datos incompletos o invalidos.',
    };
  }

  const days = end.diff(start, 'days') + 1;

  if (days > 180) {
    return {
      ok: false,
      errors: { endDate: 'Una incapacidad no puede superar los 180 dias.' },
      message: 'La incapacidad tiene datos incompletos o invalidos.',
    };
  }

  if (start.isAfter(moment().add(1, 'day'))) {
    return {
      ok: false,
      errors: { startDate: 'La fecha de inicio no puede ser futura.' },
      message: 'La incapacidad tiene datos incompletos o invalidos.',
    };
  }

  // TD-002: segunda lectura directa del almacenamiento desde la regla de negocio.
  const storedLeaves = window.localStorage.getItem('appconecta.incapacidades');
  const existingLeaves = storedLeaves ? (JSON.parse(storedLeaves) as MedicalLeave[]) : [];

  if (existingLeaves.length >= 20) {
    return {
      ok: false,
      errors: { diagnosisCode: 'Ha alcanzado el maximo de incapacidades registradas.' },
      message: 'La incapacidad tiene datos incompletos o invalidos.',
    };
  }

  const overlapping = existingLeaves.some((item) => {
    const itemStart = moment(item.startDate, 'YYYY-MM-DD', true);
    const itemEnd = moment(item.endDate, 'YYYY-MM-DD', true);

    return start.isSameOrBefore(itemEnd) && end.isSameOrAfter(itemStart);
  });

  if (overlapping) {
    return {
      ok: false,
      errors: { startDate: 'Ya existe una incapacidad registrada que cruza estas fechas.' },
      message: 'La incapacidad tiene datos incompletos o invalidos.',
    };
  }

  const status: SubmissionStatus = days > 30 ? 'en-tramite' : 'registrada';

  const record: MedicalLeave = {
    id: `INC-${moment().format('YYYYMMDD')}-${existingLeaves.length + 1}`,
    diagnosisCode: value.diagnosisCode,
    startDate: value.startDate,
    endDate: value.endDate,
    days,
    entity: value.entity,
    status,
    statusLabel: status === 'en-tramite' ? 'En tramite' : 'Registrada',
    createdAtLabel: moment().format('D [de] MMMM [de] YYYY, h:mm a'),
  };

  window.localStorage.setItem(
    'appconecta.incapacidades',
    JSON.stringify([record, ...existingLeaves].slice(0, 20))
  );

  return {
    ok: true,
    id: record.id,
    message: `Incapacidad ${record.id} registrada correctamente.`,
  };
}

/* ==========================================================================
 * Consulta de lo registrado
 *
 * TD-002 y TD-004: acceso directo al almacenamiento y claves repetidas como literales.
 * ========================================================================== */

export function getEmployeeRequests(): EmployeeRequest[] {
  const stored = window.localStorage.getItem('appconecta.solicitudes');

  if (!stored) {
    return [];
  }

  try {
    return JSON.parse(stored) as EmployeeRequest[];
  } catch {
    window.localStorage.removeItem('appconecta.solicitudes');

    return [];
  }
}

export function getMedicalLeaves(): MedicalLeave[] {
  const stored = window.localStorage.getItem('appconecta.incapacidades');

  if (!stored) {
    return [];
  }

  try {
    return JSON.parse(stored) as MedicalLeave[];
  } catch {
    window.localStorage.removeItem('appconecta.incapacidades');

    return [];
  }
}

export type DashboardSummary = {
  profile: EmployeeProfile;
  latestPayslip: Payslip | undefined;
  documentCount: number;
  highlightedAnnouncement: Announcement | undefined;
  openRequestCount: number;
  registeredLeaveCount: number;
};

export async function getDashboardSummary(): Promise<DashboardSummary> {
  const [profile, documents, payslips, announcements] = await Promise.all([
    getEmployeeProfile(),
    getLaborDocuments(),
    getPayslips(),
    getAnnouncements(),
  ]);

  const requests = getEmployeeRequests();
  const leaves = getMedicalLeaves();

  return {
    profile,
    latestPayslip: payslips[0],
    documentCount: documents.length,
    highlightedAnnouncement: announcements.find((item) => item.highlighted) ?? announcements[0],
    openRequestCount: requests.filter(
      (item) => item.status === 'registrada' || item.status === 'en-tramite'
    ).length,
    registeredLeaveCount: leaves.length,
  };
}
