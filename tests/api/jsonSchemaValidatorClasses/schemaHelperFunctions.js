const { createSchema } = require("genson-js");
const fs = require("fs/promises");
const path = require("path");

async function createJsonSchema(jsonName, responseBodyJson) {
    try {
        const schema = createSchema(responseBodyJson);
        const schemaString = JSON.stringify(schema, null, 2);
        const schemaName = path.join(__dirname, `../jsonSchemas/${jsonName}.json`);
        await writeJsonFile(schemaName, schemaString);
    } catch (err) {
        console.error(err);
    }
}

async function writeJsonFile(location, data) {
    try {
        await fs.writeFile(location, data);
    } catch (err) {
        console.error(err);
    }
}

module.exports = { createJsonSchema };
