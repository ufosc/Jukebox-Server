# Jukebox Types

## Interface Standards

All models have the following fields:

```ts
// Default fields for all models
interface IModel {
  id: number
  created_at: string
  updated_at: string
}
```

For a model `Example`, the following types would be (with sample documentation):

```ts
/**
 * Base object, has all fields from database
 */
interface IExample extends IModel {}

/**
 * Fields used to create object
 *
 * @see {@link IExample}
 */
interface IExampleCreate extends ICreate<IExample> {}

/**
 * Fields used to update object
 *
 * @see {@link IExample}
 */
interface IExampleUpdate extends IUpdate<IExample> {}

// ====================
// Optional Interfaces
// ====================
/**
 * Aggregate related data for object
 *
 * @see {@link IExample}
 */
interface IExampleDetails extends IExample {}
```

## Conventions

For a model `Example`, abide by the following:

- Objects generated from ORMs or Schemas would be called `Example`
- Interfaces called `IExample`
- All fields in object are snake case, regardless of the tech stack used. This should be especially enforced in REST APIs.
- For sub interfaces of the main interface, include `@see {@link IExample}` to allow easier access to the the main interfaces docs in the editor. The `@see` is used to notate an additional reference, and `@link` creates a hyperlink to the original object. The brackets are used to combine the decorators properly.
