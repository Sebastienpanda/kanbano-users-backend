import { DateTime } from 'luxon'
import { BaseModel, beforeCreate, beforeUpdate, belongsTo, column } from '@adonisjs/lucid/orm'
import User from '#models/user'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Column from '#models/column'

export default class Task extends BaseModel {
    @column({ isPrimary: true })
    declare id: number

    @column()
    declare title: string

    @column()
    declare description: string

    @column()
    declare order: number

    @column()
    declare columnId: string

    @column()
    declare userId: string

    @belongsTo(() => User)
    declare user: BelongsTo<typeof User>

    @belongsTo(() => Column)
    declare column: BelongsTo<typeof Column>

    @column.dateTime({ autoCreate: true })
    declare createdAt: DateTime

    @column.dateTime()
    declare updatedAt: DateTime | null

    @beforeCreate()
    static async assignOrder(task: Task) {
        if (task.order === undefined || task.order === null) {
            const lastTask = await Task.query()
                .where('columnId', task.columnId)
                .orderBy('order', 'desc')
                .first()

            task.order = lastTask ? lastTask.order + 1 : 0
        }
    }

    @beforeUpdate()
    static updateTimestamp(task: Task) {
        task.updatedAt = DateTime.now()
    }
}
