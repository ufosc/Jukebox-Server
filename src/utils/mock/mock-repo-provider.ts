import { getRepositoryToken } from '@nestjs/typeorm'
import { EntityClassOrSchema } from '@nestjs/typeorm/dist/interfaces/entity-class-or-schema.type'
import { ObjectLiteral, Repository } from 'typeorm'
export type MockType<T> = {
  [P in keyof T]?: jest.Mock<{}>
}

const mockRepo: <T extends ObjectLiteral>() => MockType<Repository<T>> = jest.fn(() => ({}))

export const getMockRepo = (repo: EntityClassOrSchema) => ({
  provide: getRepositoryToken(repo),
  useFactory: mockRepo<typeof repo>
})
