import { DateTime } from 'luxon'
import { BaseModel, beforeUpdate, belongsTo, column, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import User from '#models/user'
import Column from '#models/column'

export default class Workspace extends BaseModel {
    @column({ isPrimary: true })
    declare id: string

    @column()
    declare name: string

    @column()
    declare userId: string

    @belongsTo(() => User)
    declare user: BelongsTo<typeof User>

    @hasMany(() => Column)
    declare columns: HasMany<typeof Column>

    @column.dateTime({ autoCreate: true })
    declare createdAt: DateTime

    @column.dateTime()
    declare updatedAt: DateTime | null

    @beforeUpdate()
    static updateTimestamp(workspace: Workspace) {
        workspace.updatedAt = DateTime.now()
    }
}
