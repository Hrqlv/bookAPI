const { createJsonSchema } = require("../jsonSchemaValidatorClasses/schemaHelperFunctions");
const { expect } = require("@playwright/test");
const Ajv = require("ajv");
const fs = require("fs");
const path = require("path");

function sanitizeResponse(body) {
    if (Array.isArray(body)) {
        return body.map(sanitizeResponse);
    }

    if (body && typeof body === 'object') {
        const clean = {};

        for (const key in body) {
            if (key.startsWith('_')) continue;
            if (typeof body[key] === 'function') continue;

            clean[key] = sanitizeResponse(body[key]);
        }

        return clean;
    }

    return body;
}

function sanitizeSchema(schema) {
    if (Array.isArray(schema)) {
        return schema.map(sanitizeSchema);
    }

    if (schema && typeof schema === 'object') {
        const clean = {};

        for (const key in schema) {
            if (key.startsWith('_') || key.startsWith('.')) continue;

            if (key === 'required' && Array.isArray(schema[key])) {
                clean[key] = schema[key].filter(
                    prop => !prop.startsWith('_') && !prop.startsWith('.')
                );
                continue;
            }

            clean[key] = sanitizeSchema(schema[key]);
        }

        return clean;
    }

    return schema;
}

async function validateJsonSchema(schemaName, responseBody, createSchema = false) {

    const schemaPath = path.join(__dirname, `../jsonSchemas/${schemaName}.json`);
    
    if (createSchema || !fs.existsSync(schemaPath)) {
        const cleanBodyForSchema = sanitizeResponse(responseBody);
        await createJsonSchema(schemaName, cleanBodyForSchema);
    }

    let existingSchema = JSON.parse(fs.readFileSync(schemaPath, 'utf-8'));
    existingSchema = sanitizeSchema(existingSchema);

    const cleanBody = sanitizeResponse(responseBody);
    const ajv = new Ajv({ allErrors: false });
    const validate = ajv.compile(existingSchema);
    const validRes = validate(cleanBody);

    if (!validRes) {
        const error = validate.errors?.[0];

        if (!error) {
            throw new Error(`JSON schema validation failed but no error details were provided`);
        }

        if (error.keyword === 'required') {
            throw new Error(
                `JSON schema validation error:\n` +
                ` schemaName: ${schemaName}\n` +
                ` keyword: ${error.keyword}\n` +
                ` message: ${error.message}\n` +
                ` received: Property not found in responseBody`
            );
        }

        if (error.keyword === 'type') {
            const instancePath = error.instancePath ?? '';

            let receivedValue = cleanBody;

            if (instancePath) {
                try {
                    receivedValue = instancePath
                        .split('/')
                        .filter(key => key !== '')
                        .reduce((value, key) => value?.[key], cleanBody);
                } catch (e) {
                    receivedValue = 'Unable to resolve path';
                }
            }

            throw new Error(
                `JSON schema validation error:\n` +
                ` schemaName: ${schemaName}\n` +
                ` instancePath: ${instancePath || 'N/A'}\n` +
                ` keyword: ${error.keyword}\n` +
                ` message: ${error.message}\n` +
                ` received: ${typeof receivedValue} ("${receivedValue}")\n`
            );
        }

        throw new Error(
            `JSON schema validation error:\n` +
            ` schemaName: ${schemaName}\n` +
            ` keyword: ${error.keyword}\n` +
            ` message: ${error.message}`
        );
    }

    expect(validRes).toBe(true);
}

module.exports = { validateJsonSchema };