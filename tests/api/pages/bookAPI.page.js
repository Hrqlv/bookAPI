import { expect, request } from "@playwright/test";
import dotenv from "dotenv";

dotenv.config();

export class ServicesAPI {
    constructor() {
        this.authToken = null;
        this.urlBase = process.env.URL;
    }
    
async generateAuthToken(username, password) {
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
    this.authToken = responseBody.token;
    return responseBody;
}

async getAllBookings() {
    const context = await request.newContext({
        extraHTTPHeaders: {
            'Authorization': this.authToken
        }
    });
    const response = await context.get(`${this.urlBase}/booking`);
    return response;
}

async getBookingById(bookingId) {
    const context = await request.newContext({
        extraHTTPHeaders: {
            'Authorization': this.authToken
        }
    });
    const response = await context.get(`${this.urlBase}/booking/${bookingId}`);
    return response;
}

async createBooking(firstname, lastname, totalprice, depositpaid) {
    const context = await request.newContext({
        extraHTTPHeaders: {
            'Authorization': `Bearer ${this.authToken}`,
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

async updateBooking(bookingId, firstname, lastname, totalprice, depositpaid) {
    const context = await request.newContext({
        extraHTTPHeaders: {
            'Cookie': `token=${this.authToken}`,
            'Content-Type': 'application/json'
        }
    });
    const response = await context.put(`${this.urlBase}/booking/${bookingId}`, {
        data: {
            firstname: firstname,
            lastname: lastname,
            totalprice: totalprice,
            depositpaid: depositpaid,
            bookingdates: {
                checkin: "2026-03-27",
                checkout: "2026-04-27"
            },
            additionalneeds: "Breakfast"
        }
    });
    return response;
}

async updatePartialBooking(bookingId, firstname, lastname) {
    const context = await request.newContext({
        extraHTTPHeaders: {
            'Cookie': `token=${this.authToken}`,
            'Content-Type': 'application/json'
        }
    });
    const response = await context.patch(`${this.urlBase}/booking/${bookingId}`, {
        data: {
            firstname: firstname,
            lastname: lastname,
        }
    });
    return response;
}

async deleteBooking(bookingId) {
    const context = await request.newContext({
        extraHTTPHeaders: {
            'Cookie': `token=${this.authToken}`,
            'Content-Type': 'application/json'
        }
    });
    const response = await context.delete(`${this.urlBase}/booking/${bookingId}`);
    return response;
}

}