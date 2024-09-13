# Project Conventions

## Objects, Models, Schemas

When handling objects in typescript, often it is useful to know if the object represents minimum fields required for creation, or the full list of fields given from the model serialization process. When differentiating between the two, stick with this convention:

For some model named `Model`,

- Use `IModel` to describe all possible fields, including the ID field
- Use `IModelFields` to describe fields needed when creating the model.
