import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import { getMedicalLeaves } from '@/services/employeeService';
import { renderRoute } from '@/test/renderRoute';

const email = 'laura.restrepo@appconecta-demo.co';

async function fillValidLeave(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByLabelText(/codigo de diagnostico/i), 'J11');
  await user.type(screen.getByLabelText(/fecha de inicio/i), '2026-08-10');
  await user.type(screen.getByLabelText(/fecha de finalizacion/i), '2026-08-13');
  await user.type(screen.getByLabelText(/entidad que expide/i), 'IPS Ficticia del Norte');
  await user.type(screen.getByLabelText(/correo de contacto/i), email);
}

describe('Registro de incapacidades', () => {
  it('parte de un estado vacio explicito', () => {
    renderRoute('/incapacidades');

    expect(screen.getByText('Sin incapacidades registradas')).toBeInTheDocument();
  });

  it('registra la incapacidad y la muestra en la lista', async () => {
    const user = userEvent.setup();
    renderRoute('/incapacidades');

    await fillValidLeave(user);
    await user.click(screen.getByRole('button', { name: /registrar incapacidad/i }));

    expect(screen.getByRole('status')).toHaveTextContent(/registrada correctamente/i);

    const section = within(screen.getByRole('region', { name: /incapacidades registradas/i }));

    expect(section.getByText(/Diagnostico J11/)).toBeInTheDocument();
    expect(section.getByText(/4 dias/)).toBeInTheDocument();
    expect(getMedicalLeaves()).toHaveLength(1);
  });

  it('rechaza un codigo de diagnostico con formato invalido', async () => {
    const user = userEvent.setup();
    renderRoute('/incapacidades');

    await user.type(screen.getByLabelText(/codigo de diagnostico/i), '1234');
    await user.type(screen.getByLabelText(/fecha de inicio/i), '2026-08-10');
    await user.type(screen.getByLabelText(/fecha de finalizacion/i), '2026-08-13');
    await user.type(screen.getByLabelText(/entidad que expide/i), 'IPS Ficticia del Norte');
    await user.type(screen.getByLabelText(/correo de contacto/i), email);
    await user.click(screen.getByRole('button', { name: /registrar incapacidad/i }));

    expect(
      screen.getByText('El codigo de diagnostico debe tener el formato A00 o A000.')
    ).toBeInTheDocument();
    expect(getMedicalLeaves()).toHaveLength(0);
  });

  it('rechaza fechas invertidas', async () => {
    const user = userEvent.setup();
    renderRoute('/incapacidades');

    await user.type(screen.getByLabelText(/codigo de diagnostico/i), 'J11');
    await user.type(screen.getByLabelText(/fecha de inicio/i), '2026-08-13');
    await user.type(screen.getByLabelText(/fecha de finalizacion/i), '2026-08-10');
    await user.type(screen.getByLabelText(/entidad que expide/i), 'IPS Ficticia del Norte');
    await user.type(screen.getByLabelText(/correo de contacto/i), email);
    await user.click(screen.getByRole('button', { name: /registrar incapacidad/i }));

    expect(
      screen.getByText('La fecha de finalizacion no puede ser anterior a la de inicio.')
    ).toBeInTheDocument();
    expect(getMedicalLeaves()).toHaveLength(0);
  });
});
