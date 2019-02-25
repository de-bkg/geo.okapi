[Back to TOC](README.md)

## API

The **API** schema is located in */src/schema*. This also contains an example JSON for this API.

The ***complex persistence*** schema together with an example is also located in */src/schema*.

Information about **simple persistence** is located in */doc/permalink.md*.

### Generate API Documentation

Visit [the current API Documentation](http://sgx.geodatenzentrum.de/geo.okapi/tools/schema/view/index.html?id=api_schema)
to browse the schema. This viewer is based on [Docson](https://github.com/lbovet/docson). 

To create a custom documentation page place Docson in a web server together with the API schema and using a browser load 
**\<server_URL>/index.html#api_schema.json**

### Generate complex persistence documentation

Visit [the current persistence Documentation](http://sgx.geodatenzentrum.de/geo.okapi/tools/schema/view/index.html?id=persistence_schema)
to browse the schema. This viewer is based on [Docson](https://github.com/lbovet/docson). 

To create a custom documentation page follow the instructions given in API Documentation.

### Validate API and persistence against JSON Schema

For validating configurations against the schema use the project [validation page](http://sgx.geodatenzentrum.de/geo.okapi/tools/schema/validate/index.html)
 
The schema validator is based on [Tiny Validator for JSON Schema v4](https://github.com/geraintluff/tv4).

The schema validator checks only for schema errors. For JSON syntax checks use [JSONLint](https://jsonlint.com/) 

[Back to TOC](README.md)