type Serializable = Record<string, any>

declare interface IModelMethods<T extends Serializable> {
  serialize: () => T
}
