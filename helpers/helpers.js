import { faker } from '@faker-js/faker';

export function createUser() {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();

    return {
        firstName,
        lastName,
    };
};