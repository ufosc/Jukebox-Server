type Serializable = Record<string, any>

declare interface IModelMethods<T extends Serializable = Serializable> {
  serialize: () => T
  // static clean: (data: any) => T
}

// declare type IModelFields<T extends Serializable = Serializable> = Omit<T, 'id'>

// declare interface IModelFields<T extends Serializable = Serializable> extends Omit<T, 'id'> {
  
// }
