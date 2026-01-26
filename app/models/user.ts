import { BaseModel, column } from '@adonisjs/lucid/orm'
import { DateTime } from 'luxon'

export default class User extends BaseModel {
    static readonly table = 'neon_auth.user'

    @column({ isPrimary: true })
    declare id: string

    @column()
    declare name: string

    @column()
    declare email: string

    @column()
    declare emailVerified: boolean

    @column()
    declare image: string | null

    @column.dateTime()
    declare createdAt: DateTime

    @column.dateTime()
    declare updatedAt: DateTime
}
