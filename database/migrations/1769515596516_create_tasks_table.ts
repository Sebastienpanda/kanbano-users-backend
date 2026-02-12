import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
    protected tableName = 'tasks'

    async up() {
        this.schema.createTable(this.tableName, (table) => {
            table.uuid('id').primary().defaultTo(this.raw('uuid_generate_v4()'))

            table.string('title', 255).notNullable()
            table.text('description')
            table.integer('order').notNullable().defaultTo(0)

            table.uuid('column_id').notNullable().references('id').inTable('columns')

            table.uuid('user_id').notNullable().references('id').inTable('users')

            table.timestamp('created_at')
            table.timestamp('updated_at').nullable()

            table.index(['column_id', 'order'])
        })
    }

    async down() {
        this.schema.dropTable(this.tableName)
    }
}
