# Jukebox Types

## Interface Standards

All models have the following fields:

```ts
// Default fields for all models
interface IModel {
  id: string
  created_at: string
  updated_at: string
}
```

For a model `Example`, the following types would be:

```ts
// Base object, has all fields from database
interface IExample extends IModel {}
// Fields used to create object
interface IExampleCreate extends ICreate<IExample> {}
// Fields used to update object
interface IExampleUpdate extends IUpdate<IExample> {}

/** Optional Interfaces */
// Aggregate related data for object
interface IExampleDetails extends IExample {}
```

## Conventions

For a model `Example`, abide by the following:

- Objects generated from ORMs or Schemas would be called `Example`
- Interfaces called `IExample`
- All fields in object are snake case, regardless of the tech stack used. This should be especially enforced in REST APIs.
