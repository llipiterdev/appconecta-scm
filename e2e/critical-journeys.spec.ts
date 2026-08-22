import { test, expect, type Page } from '@playwright/test';

/**
 * Los flujos criticos son los que un colaborador ejecuta a diario. Se verifican contra el build
 * de produccion, no contra el servidor de desarrollo: comprobar un artefacto distinto del que se
 * despliega no demostraria nada sobre el artefacto desplegado.
 *
 * Cada flujo se ejecuta en los dos proyectos declarados en playwright.config.ts (movil y
 * escritorio), porque el layout responsive presenta navegaciones distintas en cada uno.
 */

function main(page: Page) {
  return page.getByRole('main');
}

test.beforeEach(async ({ page }) => {
  await page.goto('/');
});

test('el aviso de simulacion academica es visible desde la primera pantalla', async ({ page }) => {
  await expect(page.getByText(/simulaci[oó]n acad[eé]mica/i).first()).toBeVisible();
});

test('el dashboard carga el resumen del colaborador', async ({ page }) => {
  await expect(main(page).getByRole('heading', { name: 'Inicio', level: 1 })).toBeVisible();
  await expect(main(page).getByText('Ultimo desprendible')).toBeVisible();
  await expect(main(page).getByText('Documentos laborales')).toBeVisible();
  await expect(main(page).getByText('Solicitudes abiertas')).toBeVisible();
  await expect(main(page).getByText('Incapacidades registradas')).toBeVisible();
});

test('la navegacion conduce a la seccion seleccionada', async ({ page }) => {
  // La barra inferior del movil usa etiquetas cortas y la barra lateral de escritorio las
  // completas, de modo que el localizador debe admitir ambas.
  await page
    .getByRole('link', { name: /^Documentos/ })
    .first()
    .click();

  await expect(
    main(page).getByRole('heading', { name: 'Documentos laborales', level: 1 })
  ).toBeVisible();
  await expect(page).toHaveURL(/\/documentos$/);
});

test('la consulta de documentos laborales permite filtrar por categoria', async ({ page }) => {
  await page.goto('/documentos');

  const documents = main(page).getByRole('listitem');
  await expect(documents.first()).toBeVisible();
  const totalCount = await documents.count();

  await main(page).getByLabel('Filtrar por categoria').selectOption('contrato');

  const filteredCount = await documents.count();
  expect(filteredCount).toBeGreaterThan(0);
  expect(filteredCount).toBeLessThan(totalCount);
  await expect(documents.first().getByText('Contrato', { exact: true })).toBeVisible();
});

test('la consulta de nomina muestra los desprendibles con sus importes', async ({ page }) => {
  await page.goto('/nomina');

  await expect(
    main(page).getByRole('heading', { name: 'Desprendibles de nomina', level: 1 })
  ).toBeVisible();
  await expect(main(page).getByRole('listitem').first()).toBeVisible();
  await expect(main(page).getByText('Neto a pagar').first()).toBeVisible();
});

test('el colaborador registra una solicitud de Recursos Humanos', async ({ page }) => {
  await page.goto('/solicitudes');

  await main(page)
    .getByLabel(/Tipo de solicitud/)
    .selectOption('certificacion-laboral');
  await main(page)
    .getByLabel(/Detalle de la solicitud/)
    .fill('Requiero una certificacion laboral con salario para tramite bancario.');
  await main(page)
    .getByLabel(/Correo de contacto/)
    .fill('colaborador@appconecta.test');
  await main(page).getByRole('button', { name: 'Registrar solicitud' }).click();

  await expect(page.getByRole('status')).toContainText(/solicitud/i);
});

test('una solicitud incompleta comunica el error de forma accesible', async ({ page }) => {
  await page.goto('/solicitudes');

  await main(page).getByRole('button', { name: 'Registrar solicitud' }).click();

  await expect(main(page).getByLabel(/Tipo de solicitud/)).toHaveAttribute('aria-invalid', 'true');
  await expect(main(page).getByRole('alert').first()).toBeVisible();
});

test('el colaborador registra una incapacidad medica', async ({ page }) => {
  await page.goto('/incapacidades');

  await main(page)
    .getByLabel(/Codigo de diagnostico/)
    .fill('J11');
  await main(page).getByLabel('Fecha de inicio').fill('2026-08-10');
  await main(page).getByLabel('Fecha de finalizacion').fill('2026-08-12');
  await main(page)
    .getByLabel(/Entidad que expide/)
    .fill('EPS Simulada');
  await main(page)
    .getByLabel(/Correo de contacto/)
    .fill('colaborador@appconecta.test');
  await main(page).getByRole('button', { name: 'Registrar incapacidad' }).click();

  await expect(page.getByRole('status')).toContainText(/incapacidad/i);
  await expect(
    main(page).getByRole('heading', { name: 'Incapacidades registradas' })
  ).toBeVisible();
});

test('el estado de solicitudes refleja los tramites registrados', async ({ page }) => {
  await page.goto('/solicitudes');

  await main(page)
    .getByLabel(/Tipo de solicitud/)
    .selectOption('vacaciones');
  await main(page)
    .getByLabel(/Detalle de la solicitud/)
    .fill('Solicito vacaciones para la primera semana de septiembre.');
  await main(page)
    .getByLabel(/Correo de contacto/)
    .fill('colaborador@appconecta.test');
  await main(page).getByRole('button', { name: 'Registrar solicitud' }).click();
  await expect(page.getByRole('status')).toBeVisible();

  await page.goto('/estado-solicitudes');

  await expect(
    main(page).getByRole('heading', { name: 'Estado de mis solicitudes', level: 1 })
  ).toBeVisible();
  await expect(main(page).getByRole('listitem').first()).toBeVisible();
});

// CP-008 de RFC-001
test('el colaborador llega al carne virtual y visualiza el codigo QR', async ({ page }) => {
  await page
    .getByRole('link', { name: /^Carne/ })
    .first()
    .click();

  await expect(main(page).getByRole('heading', { name: 'Carne virtual', level: 1 })).toBeVisible();
  await expect(page).toHaveURL(/\/carne$/);

  const qr = main(page).getByRole('img', { name: /codigo qr del carne/i });
  await expect(qr).toBeVisible();
  await expect(qr).toHaveAttribute('src', /^data:image\/svg\+xml/);

  await expect(main(page).getByText('EMP-004821').first()).toBeVisible();
  await expect(main(page).getByText('Carne activo')).toBeVisible();

  // El criterio de aceptacion 4 de RFC-001 se comprueba tambien sobre la pantalla real: lo que
  // se codifica es visible y auditable, no una cadena que solo conoce el codigo.
  await expect(main(page).getByText('APPCONECTA|EMP-004821|ACTIVO')).toBeVisible();
});

test('una ruta inexistente presenta la pagina de error con salida a inicio', async ({ page }) => {
  await page.goto('/ruta-que-no-existe');

  await expect(main(page).getByRole('heading', { level: 1 })).toBeVisible();

  await main(page)
    .getByRole('link', { name: /inicio/i })
    .click();
  await expect(main(page).getByRole('heading', { name: 'Inicio', level: 1 })).toBeVisible();
});
