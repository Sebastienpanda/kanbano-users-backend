import { DateTime } from 'luxon'
import { BaseModel, beforeUpdate, column } from '@adonisjs/lucid/orm'

export default class User extends BaseModel {
    @column({ isPrimary: true })
    declare id: string

    @column()
    declare name: string | null

    @column()
    declare email: string

    @column.dateTime({ autoCreate: true })
    declare createdAt: DateTime

    @column.dateTime()
    declare updatedAt: DateTime | null

    @beforeUpdate()
    static updateTimestamp(user: User) {
        user.updatedAt = DateTime.now()
    }
}
