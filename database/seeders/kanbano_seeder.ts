import { BaseSeeder } from '@adonisjs/lucid/seeders'
import logger from '@adonisjs/core/services/logger'
import { WorkspaceFactory } from '#database/factories/workspace_factory'
import { ColumnFactory } from '#database/factories/column_factory'
import { TaskFactory } from '#database/factories/task_factory'

export default class extends BaseSeeder {
    async run() {
        const users = [
            'e8e3b833-4158-4c8a-95da-11d3ad565f3a',
            'a355f381-dc84-4c0a-947d-cae2fd406611',
        ]
        const columnNames = ['A faire', 'En cours', 'Terminé', 'Review']

        for (const userId of users) {
            const workspaces = await WorkspaceFactory.merge({ userId }).createMany(4)

            for (const workspace of workspaces) {
                const columns = await Promise.all(
                    columnNames.map((name, position) => {
                        return ColumnFactory.merge({
                            name,
                            position,
                            workspaceId: workspace.id,
                            userId,
                        }).create()
                    })
                )

                for (const column of columns) {
                    await Promise.all(
                        Array.from({ length: 8 }, (_, order) => {
                            return TaskFactory.merge({
                                order,
                                columnId: column.id,
                                userId,
                            }).create()
                        })
                    )
                }
            }
        }

        logger.info('Seed bien crée')
    }
}
