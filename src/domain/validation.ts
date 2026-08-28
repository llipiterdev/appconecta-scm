/**
 * Validaciones del dominio del portal del colaborador.
 *
 * `validateEmail` y `validateBoundedText` consolidan la lógica que, antes de la Actividad 4,
 * estaba escrita dos veces (una para solicitudes, otra para incapacidades). Cierra TD-003:
 * jscpd ya no detecta el clon entre ambas validaciones.
 */

import type {
  MedicalLeaveDraft,
  RequestDraft,
  RequestKind,
  ValidationResult,
} from '@/types/domain';

const REQUEST_KINDS: RequestKind[] = [
  'certificacion-laboral',
  'vacaciones',
  'permiso',
  'actualizacion-datos',
];

export function validateEmail(value: string, field: string, errors: Record<string, string>): void {
  if (value.length === 0) {
    errors[field] = 'Indique un correo de contacto.';
  } else if (!value.includes('@') || !value.includes('.')) {
    errors[field] = 'El correo de contacto no tiene un formato valido.';
  } else if (value.length > 120) {
    errors[field] = 'El correo de contacto es demasiado extenso.';
  }
}

export function validateBoundedText(
  value: string,
  field: string,
  bounds: {
    min?: number;
    max: number;
    requiredMessage: string;
    tooShortMessage?: string;
    tooLongMessage: string;
  },
  errors: Record<string, string>
): void {
  if (value.length === 0) {
    errors[field] = bounds.requiredMessage;
  } else if (bounds.min !== undefined && value.length < bounds.min && bounds.tooShortMessage) {
    errors[field] = bounds.tooShortMessage;
  } else if (value.length > bounds.max) {
    errors[field] = bounds.tooLongMessage;
  }
}

export function validateRequestDraft(draft: RequestDraft): ValidationResult<RequestDraft> {
  const errors: Record<string, string> = {};

  const kind = draft.kind.trim();
  const detail = draft.detail.trim();
  const contactEmail = draft.contactEmail.trim();

  if (kind.length === 0) {
    errors.kind = 'Seleccione el tipo de solicitud.';
  } else if (!REQUEST_KINDS.includes(kind as RequestKind)) {
    errors.kind = 'El tipo de solicitud no es valido.';
  }

  validateBoundedText(
    detail,
    'detail',
    {
      min: 15,
      max: 500,
      requiredMessage: 'Describa el detalle de la solicitud.',
      tooShortMessage: 'El detalle debe tener al menos 15 caracteres.',
      tooLongMessage: 'El detalle no puede superar los 500 caracteres.',
    },
    errors
  );

  validateEmail(contactEmail, 'contactEmail', errors);

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

  validateBoundedText(
    entity,
    'entity',
    {
      min: 4,
      max: 120,
      requiredMessage: 'Indique la entidad que expide la incapacidad.',
      tooShortMessage: 'El nombre de la entidad debe tener al menos 4 caracteres.',
      tooLongMessage: 'El nombre de la entidad es demasiado extenso.',
    },
    errors
  );

  validateEmail(contactEmail, 'contactEmail', errors);

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
