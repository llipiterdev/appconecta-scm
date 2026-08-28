import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import { getEmployeeRequests } from '@/services/employeeService';
import { renderRoute } from '@/test/renderRoute';

const detail = 'Requiero una certificacion laboral con salario para tramite bancario.';
const email = 'laura.restrepo@appconecta-demo.co';

async function fillValidRequest(user: ReturnType<typeof userEvent.setup>) {
  await user.selectOptions(screen.getByLabelText(/tipo de solicitud/i), 'certificacion-laboral');
  await user.type(screen.getByLabelText(/detalle de la solicitud/i), detail);
  await user.type(screen.getByLabelText(/correo de contacto/i), email);
}

describe('Creacion de solicitudes a Recursos Humanos', () => {
  it('registra la solicitud y confirma al colaborador', async () => {
    const user = userEvent.setup();
    renderRoute('/solicitudes');

    await fillValidRequest(user);
    await user.click(screen.getByRole('button', { name: /registrar solicitud/i }));

    expect(screen.getByRole('status')).toHaveTextContent(/registrada correctamente/i);
    expect(getEmployeeRequests()).toHaveLength(1);
  });

  it('limpia el formulario despues de registrar', async () => {
    const user = userEvent.setup();
    renderRoute('/solicitudes');

    await fillValidRequest(user);
    await user.click(screen.getByRole('button', { name: /registrar solicitud/i }));

    expect(screen.getByLabelText(/detalle de la solicitud/i)).toHaveValue('');
    expect(screen.getByLabelText(/correo de contacto/i)).toHaveValue('');
  });

  it('informa los errores de validacion sin registrar nada', async () => {
    const user = userEvent.setup();
    renderRoute('/solicitudes');

    await user.click(screen.getByRole('button', { name: /registrar solicitud/i }));

    const alerts = screen.getAllByRole('alert');

    expect(alerts.length).toBeGreaterThanOrEqual(3);
    expect(screen.getByText('Seleccione el tipo de solicitud.')).toBeInTheDocument();
    expect(getEmployeeRequests()).toHaveLength(0);
  });

  it('marca los campos invalidos para tecnologias de asistencia', async () => {
    const user = userEvent.setup();
    renderRoute('/solicitudes');

    await user.click(screen.getByRole('button', { name: /registrar solicitud/i }));

    expect(screen.getByLabelText(/tipo de solicitud/i)).toHaveAttribute('aria-invalid', 'true');
    expect(screen.getByLabelText(/detalle de la solicitud/i)).toHaveAttribute(
      'aria-invalid',
      'true'
    );
  });

  it('rechaza una solicitud duplicada', async () => {
    const user = userEvent.setup();
    renderRoute('/solicitudes');

    await fillValidRequest(user);
    await user.click(screen.getByRole('button', { name: /registrar solicitud/i }));

    await fillValidRequest(user);
    await user.click(screen.getByRole('button', { name: /registrar solicitud/i }));

    expect(screen.getByText('Ya existe una solicitud identica registrada.')).toBeInTheDocument();
    expect(getEmployeeRequests()).toHaveLength(1);
  });
});
