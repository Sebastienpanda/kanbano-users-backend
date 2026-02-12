import factory from '@adonisjs/lucid/factories'
import Column from '#models/column'
import { WorkspaceFactory } from '#database/factories/workspace_factory'
import { TaskFactory } from '#database/factories/task_factory'

export const ColumnFactory = factory
    .define(Column, async ({ faker }) => {
        return {
            name: faker.helpers.arrayElement(['A faire', 'En cours', 'Terminé', 'Review']),
            position: 0,
            workspaceId: faker.string.uuid(),
            userId: faker.string.uuid(),
        }
    })
    .relation('workspace', () => WorkspaceFactory)
    .relation('tasks', () => TaskFactory)
    .build()
