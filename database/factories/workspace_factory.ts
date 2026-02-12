import factory from '@adonisjs/lucid/factories'
import Workspace from '#models/workspace'
import { ColumnFactory } from '#database/factories/column_factory'

export const WorkspaceFactory = factory
    .define(Workspace, async ({ faker }) => {
        return {
            name: faker.company.name(),
            userId: faker.string.uuid(),
        }
    })
    .relation('columns', () => ColumnFactory)
    .build()
