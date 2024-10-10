# API Specification & Docs

## Commands

The following commands take place in the `api/` directory context.

Merging specs in `specs/` directory:

```sh
npx openapi-merge-cli
```

Generate HTML file:

```sh
npx redocly build-docs ./output.swagger.yml --output=index.html
```

## Resources

### OpenAPI Merge CLI

- Config: <https://github.com/robertmassaioli/openapi-merge/wiki/configuration>
- NPM: <https://www.npmjs.com/package/openapi-merge-cli>
- GitHub: <https://github.com/robertmassaioli/openapi-merge/tree/main/packages/openapi-merge-cli>

### Redocly

- NPM: <https://www.npmjs.com/package/@redocly/cli>
- CLI Build Options: <https://redocly.com/docs/cli/commands/build-docs>
- Config Options: <https://redocly.com/docs/cli/configuration>

### OpenAPI Generator

- Template Options: <https://openapi-generator.tech/docs/generators/>
