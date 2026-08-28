/**
 * Adaptador del contrato de nómina. Cierra TD-008 para este contrato.
 */

import moment from '@/lib/momentEs';

import { fetchPayslips } from '@/services/mockIntegrations';
import { MOCK_DATE_FORMAT } from '@/adapters/constants';
import type { Payslip } from '@/types/domain';

const currencyFormatter = new Intl.NumberFormat('es-CO', {
  style: 'currency',
  currency: 'COP',
  maximumFractionDigits: 0,
});

export async function getPayslips(): Promise<Payslip[]> {
  const response = await fetchPayslips();

  if (response.codigo_respuesta !== 200) {
    throw new Error('No fue posible consultar el sistema de nomina.');
  }

  return response.desprendibles.map((raw) => {
    const gross = Number(raw.valor_devengado);
    const deductions = Number(raw.valor_deducciones);
    const net = gross - deductions;

    const start = moment(raw.periodo_inicio, MOCK_DATE_FORMAT);
    const end = moment(raw.periodo_fin, MOCK_DATE_FORMAT);

    return {
      id: raw.cod_desprendible,
      periodLabel: `${start.format('D')} al ${end.format('D [de] MMMM [de] YYYY')}`,
      periodStart: start.format('YYYY-MM-DD'),
      periodEnd: end.format('YYYY-MM-DD'),
      grossAmount: gross,
      deductionsAmount: deductions,
      netAmount: net,
      grossAmountLabel: currencyFormatter.format(gross),
      deductionsAmountLabel: currencyFormatter.format(deductions),
      netAmountLabel: currencyFormatter.format(net),
      paymentDateLabel: moment(raw.fecha_pago, MOCK_DATE_FORMAT).format('D [de] MMMM [de] YYYY'),
    };
  });
}
