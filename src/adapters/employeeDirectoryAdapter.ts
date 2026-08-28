/**
 * Adaptador del contrato de directorio de colaboradores.
 *
 * Único punto del proyecto que conoce las claves `snake_case` de `DirectoryApiResponse`.
 * Cierra TD-008 para este contrato: el resto del dominio solo ve `EmployeeProfile`.
 */

import moment from '@/lib/momentEs';

import { fetchEmployeeDirectory } from '@/services/mockIntegrations';
import { MOCK_DATE_FORMAT } from '@/adapters/constants';
import type { EmployeeProfile } from '@/types/domain';

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
    hireDate: moment(raw.fecha_ingreso, MOCK_DATE_FORMAT).format('D [de] MMMM [de] YYYY'),
    contractType: raw.tipo_contrato,
    email: raw.correo_corporativo,
    phone: raw.telefono_movil,
    supervisor: raw.jefe_inmediato,
    cardStatus: raw.estado_carne === 1 ? 'active' : 'inactive',
  };
}
