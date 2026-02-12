import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
    protected tableName = 'columns'

    async up() {
        this.schema.createTable(this.tableName, (table) => {
            table.uuid('id', { primaryKey: true }).defaultTo(this.raw('uuid_generate_v4()'))

            table.string('name', 40).notNullable()

            table.integer('position').defaultTo(0)

            table.uuid('workspace_id').notNullable().references('id').inTable('workspaces')

            table.uuid('user_id').notNullable().references('id').inTable('users')

            table.timestamp('created_at')
            table.timestamp('updated_at').nullable()

            table.index(['workspace_id', 'position'])

            table.unique(['workspace_id', 'name'])
        })
    }

    async down() {
        this.schema.dropTable(this.tableName)
    }
}
