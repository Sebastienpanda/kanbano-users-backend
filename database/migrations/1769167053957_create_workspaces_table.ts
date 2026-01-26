import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
    protected tableName = 'workspaces'

    async up() {
        this.schema.createTable(this.tableName, (table) => {
            table.uuid('id', { primaryKey: true }).defaultTo(this.raw('uuid_generate_v4()'))

            table.string('name', 40).unique()

            table.timestamp('created_at')
            table.timestamp('updated_at').nullable()
        })
    }

    async down() {
        this.schema.dropTable(this.tableName)
    }
}
