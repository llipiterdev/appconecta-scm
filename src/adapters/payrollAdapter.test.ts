import { afterEach, describe, expect, it, vi } from 'vitest';

import { getPayslips } from '@/adapters/payrollAdapter';
import * as mockIntegrations from '@/services/mockIntegrations';

afterEach(() => {
  vi.restoreAllMocks();
});

describe('payrollAdapter', () => {
  it('propaga un error legible cuando la nomina responde con un codigo distinto de 200', async () => {
    vi.spyOn(mockIntegrations, 'fetchPayslips').mockResolvedValue({
      codigo_respuesta: 500,
      desprendibles: [],
    });

    await expect(getPayslips()).rejects.toThrow('No fue posible consultar el sistema de nomina');
  });
});
