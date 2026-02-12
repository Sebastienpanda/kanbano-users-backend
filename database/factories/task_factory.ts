import factory from '@adonisjs/lucid/factories'
import Task from '#models/task'

export const TaskFactory = factory

    .define(Task, async ({ faker }) => {
        return {
            title: faker.lorem.sentence({ min: 3, max: 8 }),
            description: faker.lorem.paragraphs(3),
            order: 0,
            columnId: faker.string.uuid(),
            userId: faker.string.uuid(),
        }
    })
    .build()
