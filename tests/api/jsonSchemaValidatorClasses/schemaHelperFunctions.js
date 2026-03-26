import { createSchema } from "genson-js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function createJsonSchema(jsonName, responseBodyJson) {
    try {
        const schema = createSchema(responseBodyJson);
        const schemaString = JSON.stringify(schema, null, 2);
        const schemaName = path.join(__dirname, `../jsonSchemas/${jsonName}.json`);
        await writeJsonFile(schemaName, schemaString);
    } catch (err) {
        console.error(err);
        throw err;
    }
}

export async function writeJsonFile(location, data) {
    try {
        await fs.promises.writeFile(location, data);
    } catch (err) {
        console.error(err);
        throw err;
    }
}