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
})