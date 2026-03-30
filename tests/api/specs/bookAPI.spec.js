import { test, expect } from '@playwright/test';
import { ServicesAPI } from '../pages/bookAPI.page';
import { validateJsonSchema } from "../jsonSchemaValidatorClasses/validateJsonSchema";
import { createUser } from "../../../helpers/helpers";

let servicesApi;
let user = createUser();
let bookingId;

test.describe('API Tests @API @CI', () => {
  test.beforeEach(async ({ page }) => {
    user = createUser();
    servicesApi = new ServicesAPI();

    const authResponse = await servicesApi.generateAuthToken('admin', 'password123');
    await validateJsonSchema('POST_CreateToken', authResponse);
    expect(authResponse.token).toBeDefined();
});

test.describe('Fluxos de sucesso', () => {
    test('Criar reserva com dados válidos', async ({ page }) => {
    await test.step('POST /booking - Criar nova reserva', async () => {
        const response = await servicesApi.createBooking(user.firstName, user.lastName, '80', 'true');
        const responseBody = await response.json();
        await validateJsonSchema('POST_NewBook', responseBody);
        expect(response.status()).toBe(200);
        expect(responseBody.bookingid).toBeDefined();
        bookingId = responseBody.bookingid;
    });
})

test('Atualizar reserva pelo ID', async ({ page }) => {
    await test.step('PUT /booking/:id - Atualizar reserva criada', async () => {
        const response = await servicesApi.updateBooking(bookingId, user.firstName, user.lastName, '150', 'true');
        const responseBody = await response.json();
        await validateJsonSchema('PUT_UpdateBooking', responseBody);
        expect(response.status()).toBe(200);
        expect(responseBody.firstname).toBe(user.firstName);
        expect(responseBody.lastname).toBe(user.lastName);
        expect(responseBody.totalprice).toBe(150);
        expect(responseBody.depositpaid).toBe(true);
        expect(responseBody.bookingdates).toHaveProperty('checkin');
        expect(responseBody.bookingdates).toHaveProperty('checkout');
        expect(responseBody).toHaveProperty('additionalneeds');
    });
})

test('Atualizar alguns dados da reserva pelo ID', async ({ page }) => {
    await test.step('PATCH /booking/:id - Atualizar alguns dados da reserva criada', async () => {
        const response = await servicesApi.updatePartialBooking(bookingId, user.firstName, user.lastName);
        const responseBody = await response.json();
        await validateJsonSchema('PATCH_UpdatePartialBooking', responseBody);
        expect(response.status()).toBe(200);
        expect(responseBody.firstname).toBe(user.firstName);
        expect(responseBody.lastname).toBe(user.lastName);
    });
})

test('Buscar reserva pelo ID', async ({ page }) => {
    await test.step('GET /booking/:id - Buscar reserva criada', async () => {
        const response = await servicesApi.getBookingById(bookingId);
        const responseBody = await response.json();
        await validateJsonSchema('GET_BookID', responseBody);
        expect(response.status()).toBe(200);
        expect(responseBody).toHaveProperty('firstname');
        expect(responseBody).toHaveProperty('lastname');
        expect(responseBody).toHaveProperty('totalprice');
        expect(responseBody).toHaveProperty('depositpaid');
        expect(responseBody).toHaveProperty('bookingdates');
        expect(responseBody.bookingdates).toHaveProperty('checkin');
        expect(responseBody.bookingdates).toHaveProperty('checkout');
        expect(responseBody).toHaveProperty('additionalneeds');
    });
})

test('Buscar todas as reservas', async ({ page }) => {
    await test.step('GET /booking - Listar todas as reservas', async () => {
        const response = await servicesApi.getAllBookings();
        const responseBody = await response.json();
        await validateJsonSchema('GET_AllBook', responseBody);
        expect(response.status()).toBe(200);
        expect(Array.isArray(responseBody)).toBe(true);
        expect(responseBody.length).toBeGreaterThan(0);
        expect(responseBody[0]).toHaveProperty('bookingid');
    });
})

test('Deletar reserva pelo ID', async ({ page }) => {
    await test.step('DELETE /booking/:id - Deletar reserva criada', async () => {
        const response = await servicesApi.deleteBooking(bookingId);
        expect(response.status()).toBe(201);
        const responseBody = await response.text();
        expect(responseBody).toBe('Created');
    });
})
})

test.describe('Fluxos negativo', () => {
      test('Buscar reserva com ID inexistente', async ({ page }) => {
        await test.step('GET /booking/:id - Deve retornar 404', async () => {
            const response = await servicesApi.getBookingById(9999);
            expect(response.status()).toBe(404);
        });
    });

    test('Deletar reserva com ID inexistente', async ({ page }) => {
        await test.step('DELETE /booking/:id - Deve retornar 405', async () => {
            const response = await servicesApi.deleteBooking(9999);
            expect(response.status()).toBe(405);
        });
    });

    test('Atualizar reserva com token inválido', async ({ page }) => {
        await test.step('PUT /booking/:id - Deve retornar 403', async () => {
            servicesApi.authToken = 'abcd65948aa50a1';
            const response = await servicesApi.updateBooking(9999, user.firstName, user.lastName, '100', 'true');
            expect(response.status()).toBe(403);
        });
    });

    test('Atualizar reserva parcial com token inválido', async ({ page }) => {
        await test.step('PATCH /booking/:id - Deve retornar 403', async () => {
            servicesApi.authToken = 'abcd65948aa50a1';
            const response = await servicesApi.updatePartialBooking(9999, user.firstName, user.lastName);
            expect(response.status()).toBe(403);
        });
    });

    test('Deletar reserva com token inválido', async ({ page }) => {
        await test.step('DELETE /booking/:id - Deve retornar 403', async () => {
            servicesApi.authToken = 'abcd65948aa50a1';
            const response = await servicesApi.deleteBooking(9999);
            expect(response.status()).toBe(403);
        });
    });

    test('Gerar token com credenciais inválidas', async ({ page }) => {
        await test.step('POST /auth - Deve retornar erro de credenciais', async () => {
            const responseBody = await servicesApi.generateAuthToken('adminn', 'password1234');
            expect(responseBody.reason).toBe('Bad credentials');
        });
    });
})
})