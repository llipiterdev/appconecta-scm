export type EmployeeProfile = {
  id: string;
  fullName: string;
  documentNumber: string;
  position: string;
  department: string;
  costCenter: string;
  location: string;
  hireDate: string;
  contractType: string;
  email: string;
  phone: string;
  supervisor: string;
  cardStatus: 'active' | 'inactive';
};

export type VirtualCardStatus = 'active' | 'inactive';

export type VirtualCard = {
  employeeCode: string;
  fullName: string;
  position: string;
  department: string;
  hireDate: string;
  status: VirtualCardStatus;
  statusLabel: string;
  /**
   * Contenido codificado en el QR. Solo codigo de empleado y estado: un QR es legible por
   * cualquiera con una camara, de modo que su contenido es publico por construccion.
   */
  qrPayload: string;
};

export type LaborDocument = {
  id: string;
  title: string;
  category: 'contrato' | 'certificacion' | 'anexo' | 'politica';
  issuedAt: string;
  issuedAtLabel: string;
  sizeLabel: string;
  format: string;
};

export type Payslip = {
  id: string;
  periodLabel: string;
  periodStart: string;
  periodEnd: string;
  grossAmount: number;
  deductionsAmount: number;
  netAmount: number;
  grossAmountLabel: string;
  deductionsAmountLabel: string;
  netAmountLabel: string;
  paymentDateLabel: string;
};

export type Announcement = {
  id: string;
  title: string;
  summary: string;
  category: 'bienestar' | 'operaciones' | 'reconocimiento' | 'tecnologia';
  publishedAtLabel: string;
  relativeLabel: string;
  highlighted: boolean;
};

export type RequestKind =
  'certificacion-laboral' | 'vacaciones' | 'permiso' | 'actualizacion-datos';

export type SubmissionStatus = 'registrada' | 'en-tramite' | 'aprobada' | 'rechazada';

export type EmployeeRequest = {
  id: string;
  kind: RequestKind;
  kindLabel: string;
  detail: string;
  status: SubmissionStatus;
  statusLabel: string;
  createdAtLabel: string;
  expectedResponseLabel: string;
};

export type MedicalLeave = {
  id: string;
  diagnosisCode: string;
  startDate: string;
  endDate: string;
  days: number;
  entity: string;
  status: SubmissionStatus;
  statusLabel: string;
  createdAtLabel: string;
};

export type RequestDraft = {
  kind: string;
  detail: string;
  contactEmail: string;
};

export type MedicalLeaveDraft = {
  diagnosisCode: string;
  startDate: string;
  endDate: string;
  entity: string;
  contactEmail: string;
};

export type ValidationResult<T> =
  { ok: true; value: T } | { ok: false; errors: Record<string, string> };
