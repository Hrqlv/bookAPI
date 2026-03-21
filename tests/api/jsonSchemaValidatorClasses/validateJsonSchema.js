const { createJsonSchema } = require("./schemaHelperFunctions");
const { expect } = require("@playwright/test");
const Ajv = require("ajv");
const fs = require("fs");
const path = require("path");

async function validateJsonSchema(schemaName, responseBody, createSchema = false) {
    const schemaPath = path.join(__dirname, `../jsonSchemas/${schemaName}.json`);
    
    if (createSchema || !fs.existsSync(schemaPath)) {
        await createJsonSchema(schemaName, responseBody);
    }

    const existingSchema = JSON.parse(fs.readFileSync(schemaPath, 'utf-8'));
    const ajv = new Ajv({ allErrors: false });
    const validate = ajv.compile(existingSchema);
    const validRes = validate(responseBody);
    let error;

    if (!validRes) {
        error = validate.errors[0];
        if (error.keyword === 'required') {
            throw new Error(`JSON schema validation error:\n schemaName: ${schemaName}\n keyword: ${error.keyword}\n message: ${error.message}\n received: Property not found in responseBody`);
        } else if (error.keyword === 'type') {
            const instancePath = error.instancePath;
            const receivedValue = instancePath.split('/').filter(key => key !== '').reduce((value, key) => value[key], responseBody);
            throw new Error(`JSON schema validation error:\n schemaName: ${schemaName}\n instancePath: ${instancePath}\n keyword: ${error.keyword}\n message: ${error.message}\n received: ${typeof receivedValue} ("${receivedValue}")\n`);
        }
    }
    expect(validRes).toBe(true);
}

module.exports = { validateJsonSchema };
