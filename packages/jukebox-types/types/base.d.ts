declare interface IModel {
  id: number
  created_at: string // Serialized Date
  updated_at: string // Serialized Date
}

declare type ICreate<T> = Partial<Omit<T, 'id' | 'created_at' | 'updated_at'>>
declare type IUpdate<T> = Partial<Omit<T, 'id' | 'created_at' | 'updated_at'>>
