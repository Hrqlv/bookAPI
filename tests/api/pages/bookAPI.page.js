import { expect, request } from "@playwright/test";

export class ServicesAPI {
    constructor() {
        this.authToken = null;
        this.urlBase = 'https://restful-booker.herokuapp.com';
    }
    
    async createToken(username, password) {
        const context = await request.newContext();
        const response = await context.post(`${this.urlBase}/auth`, {
            data: {
                username: username,
                password: password
              },
            headers: {
                'Content-Type': 'application/json'
            },
        });
        expect(response.status(), `Request (/auth) failed\nStatus: ${(response.status())} ${response.statusText()}`).toBe(200);
        const responseBody = await response.json();
        this.authToken = responseBody.authorization;
        return responseBody;
    }

    async getBook() {
        const context = await request.newContext({
            extraHTTPHeaders: {
                'Authorization': this.authToken
            }
        });
        const response = await context.get(`${this.urlBase}/booking`);
        return response;
    }

    async getBookID(id) {
        const context = await request.newContext({
            extraHTTPHeaders: {
                'Authorization': this.authToken
            }
        });
        const response = await context.get(`${this.urlBase}/booking/${id}`);
        return response;
    }

    async createBook(firstname, lastname, totalprice, depositpaid) {
        const authTokenHeader = `Bearer ${this.authToken}`; 
        const context = await request.newContext({
            extraHTTPHeaders: {
                'Authorization': authTokenHeader,
                'Content-Type': 'application/json'
            }
        });
        const response = await context.post(`${this.urlBase}/booking`, {
            data: {
                firstname: firstname,
                lastname: lastname,
                totalprice: totalprice,
                depositpaid: depositpaid,
                bookingdates: {
                checkin: "2026-01-01",
                checkout: "2026-01-10"
            },
            additionalneeds: "Breakfast"
            }
        });
        return response;
    }

    async updateBook() {

    }

    async updatePartialBook() {

    }

    async deleteBook() {

    }
}