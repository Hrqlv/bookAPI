import createSchema from "genson-js";
import fs from "fs";
import path from "path";

export async function createJsonSchema(jsonName, responseBodyJson) {
    try {
        const schema = createSchema(responseBodyJson);
        const schemaString = JSON.stringify(schema, null, 2);
        const schemaName = path.join(__dirname, `../jsonSchemas/${jsonName}.json`);
        await writeJsonFile(schemaName, schemaString);
    } catch (err) {
        console.error(err);
    }
}

export async function writeJsonFile(location, data) {
    try {
        await fs.writeFile(location, data);
    } catch (err) {
        console.error(err);
    }
}