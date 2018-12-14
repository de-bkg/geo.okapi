[Back to TOC](README.md)

## API

The **API** schema is located in */src/schema*. In this folder is also an example JSON for this API.

The ***complex persistence*** schema together with an example is also located in */src/schema*.

Information about **simple persistence** is located in */doc/permalink.md*.

### Generate API Documentation

We can use Docson (https://github.com/lbovet/docson) to generate a Website with the documentation of the API schema. 

Place Docson in a web server together with the API schema and using a browser load 
**\<server_URL>/index.html#api_schema.json**

[//]: # "TODO: link to schema website"

### Generate complex persistence documentation

In the web server where Docson is located, place the complex persistence schema. Using a browser load 
**\<server_URL>/index.html#persistence_chema.json**

[//]: # "TODO: link to schema website"

### Validate API and persistence against JSON Schema

For the validation against API schema we can use Tiny Validator for JSON Schema v4 (https://github.com/geraintluff/tv4).

Place Tiny Validator in a web server together with the API schema and using a browser load the index.html.

Note: Edit the position and filename of schema in *app.js* (Line 2) if needed.

[//]: # "TODO: link to validator" 

[Back to TOC](README.md)