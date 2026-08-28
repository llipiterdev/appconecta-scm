import { afterEach, describe, expect, it, vi } from 'vitest';

import { getEmployeeProfile } from '@/adapters/employeeDirectoryAdapter';
import * as mockIntegrations from '@/services/mockIntegrations';

afterEach(() => {
  vi.restoreAllMocks();
});

describe('employeeDirectoryAdapter', () => {
  it('marca el carne como inactivo cuando el contrato reporta un estado distinto de 1', async () => {
    vi.spyOn(mockIntegrations, 'fetchEmployeeDirectory').mockResolvedValue({
      codigo_respuesta: 200,
      empleado: {
        cod_empleado: 'EMP-1',
        nombre_completo: 'Prueba',
        num_documento: '1',
        cargo: 'Analista',
        area: 'Operaciones',
        centro_costo: 'CC-1',
        sede: 'Bogota',
        fecha_ingreso: '01/01/2020',
        tipo_contrato: 'Indefinido',
        correo_corporativo: 'prueba@appconecta-demo.co',
        telefono_movil: '+57 300 0000000',
        jefe_inmediato: 'Jefe',
        estado_carne: 0,
      },
    });

    const profile = await getEmployeeProfile();

    expect(profile.cardStatus).toBe('inactive');
  });

  it('propaga un error legible cuando el directorio responde con un codigo distinto de 200', async () => {
    vi.spyOn(mockIntegrations, 'fetchEmployeeDirectory').mockResolvedValue({
      codigo_respuesta: 500,
      empleado: {} as never,
    });

    await expect(getEmployeeProfile()).rejects.toThrow('No fue posible consultar el directorio');
  });
});
