import { describe, expect, it } from 'vitest';

import {
  getAnnouncements,
  getEmployeeRequests,
  getLaborDocuments,
  getMedicalLeaves,
  getPayslips,
  getEmployeeProfile,
  processSubmission,
  validateMedicalLeaveDraft,
  validateRequestDraft,
} from '@/services/legacyEmployeeService';

const validRequest = {
  kind: 'certificacion-laboral',
  detail: 'Requiero una certificacion laboral con salario para tramite bancario.',
  contactEmail: 'laura.restrepo@appconecta-demo.co',
};

const validLeave = {
  diagnosisCode: 'J11',
  startDate: '2026-08-10',
  endDate: '2026-08-13',
  entity: 'IPS Ficticia del Norte',
  contactEmail: 'laura.restrepo@appconecta-demo.co',
};

describe('Transformacion de los contratos de integracion simulados', () => {
  it('normaliza el perfil del colaborador desde el directorio', async () => {
    const profile = await getEmployeeProfile();

    expect(profile.id).toBe('EMP-004821');
    expect(profile.fullName).toBe('Laura Catalina Restrepo Mejia');
    expect(profile.cardStatus).toBe('active');
    expect(profile.hireDate).toMatch(/2019/);
  });

  it('clasifica los documentos laborales y formatea su tamano', async () => {
    const documents = await getLaborDocuments();

    expect(documents).toHaveLength(5);
    expect(documents.map((document) => document.category)).toEqual(
      expect.arrayContaining(['contrato', 'anexo', 'certificacion', 'politica'])
    );
    expect(documents[0].sizeLabel).toMatch(/^\d+(\.\d+)? (KB|MB)$/);
    expect(documents[0].issuedAt).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  it('calcula el neto de cada desprendible a partir del devengado y las deducciones', async () => {
    const payslips = await getPayslips();

    expect(payslips.length).toBeGreaterThan(0);

    for (const payslip of payslips) {
      expect(payslip.netAmount).toBe(payslip.grossAmount - payslip.deductionsAmount);
      expect(payslip.netAmountLabel).toContain('$');
    }
  });

  it('marca la publicacion destacada del canal de comunicaciones', async () => {
    const announcements = await getAnnouncements();

    expect(announcements.filter((announcement) => announcement.highlighted)).toHaveLength(1);
  });
});

describe('validateRequestDraft', () => {
  it('acepta una solicitud completa y normaliza los espacios', () => {
    const result = validateRequestDraft({
      ...validRequest,
      contactEmail: `  ${validRequest.contactEmail}  `,
    });

    expect(result.ok).toBe(true);

    if (result.ok) {
      expect(result.value.contactEmail).toBe(validRequest.contactEmail);
    }
  });

  it('exige el tipo de solicitud', () => {
    const result = validateRequestDraft({ ...validRequest, kind: '' });

    expect(result.ok).toBe(false);

    if (!result.ok) {
      expect(result.errors.kind).toBe('Seleccione el tipo de solicitud.');
    }
  });

  it('rechaza un tipo de solicitud desconocido', () => {
    const result = validateRequestDraft({ ...validRequest, kind: 'prestamo' });

    expect(result.ok).toBe(false);

    if (!result.ok) {
      expect(result.errors.kind).toBe('El tipo de solicitud no es valido.');
    }
  });

  it('exige un detalle de al menos 15 caracteres', () => {
    const result = validateRequestDraft({ ...validRequest, detail: 'muy corto' });

    expect(result.ok).toBe(false);

    if (!result.ok) {
      expect(result.errors.detail).toContain('15 caracteres');
    }
  });

  it('rechaza un correo sin formato valido', () => {
    const result = validateRequestDraft({ ...validRequest, contactEmail: 'laura-arroba-nada' });

    expect(result.ok).toBe(false);

    if (!result.ok) {
      expect(result.errors.contactEmail).toContain('formato valido');
    }
  });
});

describe('validateMedicalLeaveDraft', () => {
  it('acepta una incapacidad completa y normaliza el diagnostico', () => {
    const result = validateMedicalLeaveDraft({ ...validLeave, diagnosisCode: 'j11' });

    expect(result.ok).toBe(true);

    if (result.ok) {
      expect(result.value.diagnosisCode).toBe('J11');
    }
  });

  it('rechaza un codigo de diagnostico con formato invalido', () => {
    const result = validateMedicalLeaveDraft({ ...validLeave, diagnosisCode: '1234' });

    expect(result.ok).toBe(false);

    if (!result.ok) {
      expect(result.errors.diagnosisCode).toContain('formato');
    }
  });

  it('exige la entidad que expide la incapacidad', () => {
    const result = validateMedicalLeaveDraft({ ...validLeave, entity: '' });

    expect(result.ok).toBe(false);

    if (!result.ok) {
      expect(result.errors.entity).toBe('Indique la entidad que expide la incapacidad.');
    }
  });
});

describe('processSubmission — solicitudes de Recursos Humanos', () => {
  it('registra la solicitud y la persiste localmente', () => {
    const outcome = processSubmission('request', validRequest);

    expect(outcome.ok).toBe(true);

    const stored = getEmployeeRequests();

    expect(stored).toHaveLength(1);
    expect(stored[0].kindLabel).toBe('Certificacion laboral');
    expect(stored[0].status).toBe('registrada');
    expect(stored[0].detail).toBe(validRequest.detail);
  });

  it('calcula una fecha de respuesta en dia habil', () => {
    processSubmission('request', validRequest);

    const [stored] = getEmployeeRequests();

    expect(stored.expectedResponseLabel).not.toContain('sabado');
    expect(stored.expectedResponseLabel).not.toContain('domingo');
  });

  it('rechaza una solicitud identica ya registrada', () => {
    processSubmission('request', validRequest);
    const outcome = processSubmission('request', validRequest);

    expect(outcome.ok).toBe(false);

    if (!outcome.ok) {
      expect(outcome.errors.detail).toContain('solicitud identica');
    }

    expect(getEmployeeRequests()).toHaveLength(1);
  });

  it('no persiste nada cuando la validacion falla', () => {
    const outcome = processSubmission('request', { ...validRequest, detail: 'corto' });

    expect(outcome.ok).toBe(false);
    expect(getEmployeeRequests()).toHaveLength(0);
  });
});

describe('processSubmission — incapacidades', () => {
  it('registra la incapacidad y calcula los dias inclusive', () => {
    const outcome = processSubmission('medical-leave', validLeave);

    expect(outcome.ok).toBe(true);

    const [stored] = getMedicalLeaves();

    expect(stored.days).toBe(4);
    expect(stored.diagnosisCode).toBe('J11');
    expect(stored.status).toBe('registrada');
  });

  it('marca en tramite las incapacidades superiores a treinta dias', () => {
    processSubmission('medical-leave', {
      ...validLeave,
      startDate: '2026-06-01',
      endDate: '2026-07-15',
    });

    const [stored] = getMedicalLeaves();

    expect(stored.days).toBe(45);
    expect(stored.status).toBe('en-tramite');
    expect(stored.statusLabel).toBe('En tramite');
  });

  it('rechaza una fecha de finalizacion anterior a la de inicio', () => {
    const outcome = processSubmission('medical-leave', {
      ...validLeave,
      startDate: '2026-08-13',
      endDate: '2026-08-10',
    });

    expect(outcome.ok).toBe(false);

    if (!outcome.ok) {
      expect(outcome.errors.endDate).toContain('anterior');
    }

    expect(getMedicalLeaves()).toHaveLength(0);
  });

  it('rechaza una incapacidad que cruza fechas con otra registrada', () => {
    processSubmission('medical-leave', validLeave);

    const outcome = processSubmission('medical-leave', {
      ...validLeave,
      startDate: '2026-08-12',
      endDate: '2026-08-16',
    });

    expect(outcome.ok).toBe(false);

    if (!outcome.ok) {
      expect(outcome.errors.startDate).toContain('cruza');
    }

    expect(getMedicalLeaves()).toHaveLength(1);
  });

  it('rechaza una fecha de inicio futura', () => {
    const outcome = processSubmission('medical-leave', {
      ...validLeave,
      startDate: '2099-01-01',
      endDate: '2099-01-05',
    });

    expect(outcome.ok).toBe(false);

    if (!outcome.ok) {
      expect(outcome.errors.startDate).toContain('futura');
    }
  });

  it('rechaza una incapacidad de mas de ciento ochenta dias', () => {
    const outcome = processSubmission('medical-leave', {
      ...validLeave,
      startDate: '2025-01-01',
      endDate: '2025-12-31',
    });

    expect(outcome.ok).toBe(false);

    if (!outcome.ok) {
      expect(outcome.errors.endDate).toContain('180 dias');
    }
  });
});

describe('Lectura tolerante del almacenamiento local', () => {
  it('descarta el contenido corrupto en lugar de propagar el error', () => {
    window.localStorage.setItem('appconecta.solicitudes', '{ esto no es json');

    expect(getEmployeeRequests()).toEqual([]);
    expect(window.localStorage.getItem('appconecta.solicitudes')).toBeNull();
  });

  it('devuelve una lista vacia cuando no hay incapacidades registradas', () => {
    expect(getMedicalLeaves()).toEqual([]);
  });
});
