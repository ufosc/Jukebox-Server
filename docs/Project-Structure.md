# Project Structure

```txt
jukebox-server/
|-- proxy/
|-- deploy/
|-- src
    |-- [module]/
    |   |-- [module].module.ts      <-- Module root
    |   |-- [module].controller.ts  <-- Api routes defined, no business logic
    |   |-- [module].service.ts     <-- Business logic
    |   |-- [module].gateway.ts     <-- Websocket input/output router, no business logic
    |   |-- tests/
    |   |   |-- [module].[type].spec.ts
    |   |-- dto/
    |   |   |-- [model].dto.ts      <-- Api input/output object structures
    |   |-- schemas/
    |   |   |-- [model].schema.ts   <-- Mongoose schemas

```
