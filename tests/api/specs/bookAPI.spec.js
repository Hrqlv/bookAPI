const { test, expect } = require('@playwright/test');
import { ServicesAPI } from '../pages/bookAPI.page';
import { validateJsonSchema } from "../jsonSchemaValidatorClasses/validateJsonSchema";

let servicesApi;

test.describe('API Tests @API @CI', () => {
    test.beforeEach(async ({ page }) => {
        servicesApi = new ServicesAPI();

        const usuarioBody = await servicesApi.createToken('admin', 'password123');
        await validateJsonSchema('POST_CreateToken', usuarioBody);
        expect(usuarioBody.token).toBeDefined();
    });

    test('Buscar todos os livros', async ({ page }) => {
        await test.step('Obter os livros - GET', async () => {
            const bookingResponse = await servicesApi.getBook();
            const bookBody = await bookingResponse.json();
            await validateJsonSchema('GET_AllBook', bookBody);
            expect(bookingResponse.status()).toBe(200);
            expect(Array.isArray(bookBody)).toBe(true);
            expect(bookBody.length).toBeGreaterThan(0);
            expect(bookBody[0]).toHaveProperty('bookingid');
        });
    })

     test('Buscar livro pelo ID', async ({ page }) => {
        await test.step('Obter o livro - GET', async () => {
            const listResponse = await servicesApi.getBook();
            const listBody = await listResponse.json();
            expect(listResponse.status()).toBe(200);
            expect(listBody.length).toBeGreaterThan(0);
            const bookingId = listBody[0].bookingid;
            const bookingResponse = await servicesApi.getBookID(bookingId);
            const bookBody = await bookingResponse.json();
            await validateJsonSchema('GET_BookID', bookBody);
            expect(bookBody).toHaveProperty('firstname');
            expect(bookBody).toHaveProperty('lastname');
            expect(bookBody).toHaveProperty('totalprice');
            expect(bookBody).toHaveProperty('depositpaid');
            expect(bookBody).toHaveProperty('bookingdates');
            expect(bookBody.bookingdates).toHaveProperty('checkin');
            expect(bookBody.bookingdates).toHaveProperty('checkout')
            expect(bookBody).toHaveProperty('additionalneeds');
        });
    })
} )