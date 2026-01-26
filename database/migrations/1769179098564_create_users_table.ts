import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
    protected tableName = 'workspaces'

    async up() {
        this.schema.alterTable(this.tableName, (table) => {
            table.uuid('user_id').notNullable().references('id').inTable('neon_auth.user')
        })
    }

    async down() {
        this.schema.alterTable(this.tableName, (table) => {
            table.dropForeign(['user_id'])
            table.dropColumn('user_id')
        })
    }
}
