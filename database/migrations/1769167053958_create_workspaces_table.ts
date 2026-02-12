import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
    protected tableName = 'workspaces'

    async up() {
        this.schema.createTable(this.tableName, (table) => {
            table.uuid('id', { primaryKey: true }).defaultTo(this.raw('uuid_generate_v4()'))

            table.string('name', 40).notNullable()

            table
                .uuid('user_id')
                .notNullable()
                .defaultTo(this.raw('public.auth_uid()'))
                .references('id')
                .inTable('users')

            table.timestamp('created_at')
            table.timestamp('updated_at').nullable()

            table.index('user_id')

            table.unique(['user_id', 'name'])
        })
    }

    async down() {
        this.schema.dropTable(this.tableName)
    }
}
