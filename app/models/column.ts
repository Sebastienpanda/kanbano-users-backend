import { DateTime } from 'luxon'
import {
    BaseModel,
    beforeCreate,
    beforeUpdate,
    belongsTo,
    column,
    hasMany,
} from '@adonisjs/lucid/orm'
import User from '#models/user'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import Workspace from '#models/workspace'
import Task from '#models/task'

export default class Column extends BaseModel {
    @column({ isPrimary: true })
    declare id: string

    @column()
    declare name: string

    @column()
    declare position: number

    @column()
    declare workspaceId: string

    @column()
    declare userId: string

    @belongsTo(() => User)
    declare user: BelongsTo<typeof User>

    @belongsTo(() => Workspace)
    declare workspace: BelongsTo<typeof Workspace>

    @hasMany(() => Task)
    declare tasks: HasMany<typeof Task>

    @column.dateTime({ autoCreate: true })
    declare createdAt: DateTime

    @column.dateTime()
    declare updatedAt: DateTime | null

    @beforeCreate()
    static async assignPosition(columns: Column) {
        if (columns.position === undefined || columns.position === null) {
            const lastColumn = await Column.query()
                .where('workspaceId', columns.workspaceId)
                .orderBy('position', 'desc')
                .first()

            columns.position = lastColumn ? lastColumn.position + 1 : 0
        }
    }

    @beforeUpdate()
    static updateTimestamp(columns: Column) {
        columns.updatedAt = DateTime.now()
    }
}
