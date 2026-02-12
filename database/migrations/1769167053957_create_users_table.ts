import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
    protected tableName = 'users'

    async up() {
        this.schema.createTable(this.tableName, (table) => {
            table.uuid('id', { primaryKey: true }).notNullable()

            table.string('name', 40).nullable()

            table.string('email').unique().notNullable()

            table.timestamp('created_at').defaultTo(this.now())
            table.timestamp('updated_at').nullable()
        })
    }

    async down() {
        this.schema.dropTable(this.tableName)
    }
}
