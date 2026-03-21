const { test, expect } = require('@playwright/test');
import { ServicesAPI } from '../pages/bookAPI.page';
import { validateJsonSchema } from "../jsonSchemaValidatorClasses/validateJsonSchema";

let servicesApi;

test.describe('API Tests @API @CI', () => {
    test.beforeEach(async ({ page }) => {
        servicesApi = new ServicesAPI();

        // Fazer o acesso
        const usuarioBody = await servicesApi.createToken('admin', 'password123');
        await validateJsonSchema('POST_CreateToken', usuarioBody);
        expect(usuarioBody.message).toEqual('Acesso realizado com sucesso');
    
    });

           // Fluxo de usuario
    test('Realizar fluxo de buscar livros', async ({ page }) => {
        await test.step('Obter os livros - GET', async () => {
            const bookingResponse = await servicesApi.getBook();
            await validateJsonSchema('GET_NewUser', bookingResponse);
            const bookBody = await bookingResponse.json();
            expect(bookingResponse.status()).toBe(200);
            expect(bookBody).toHaveProperty('booking');
            expect(bookBody.usuarios.length).toBeGreaterThan(0);
        });
    })
})