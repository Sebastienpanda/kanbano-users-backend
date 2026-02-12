import Column from '#models/column'
import { CreateColumnDto, UpdateColumnDto } from '#dto/create_column_dto'

export default class ColumnsRepository {
    async findAllByWorkspace(workspaceId: string): Promise<Column[]> {
        return Column.query()
            .where('workspaceId', workspaceId)
            .orderBy('position', 'asc')
            .preload('tasks', (task) => {
                task.orderBy('order', 'asc')
            })
    }

    async create(data: CreateColumnDto): Promise<Column> {
        return await Column.create(data)
    }

    async findById(id: string): Promise<Column | null> {
        return await Column.findOrFail(id)
    }

    async update(column: Column, data: UpdateColumnDto): Promise<Column> {
        await column.merge(data).save()
        return column
    }
}
