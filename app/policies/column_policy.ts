import { BasePolicy } from '@adonisjs/bouncer'
import Column from '#models/column'
import { AuthorizerResponse } from '@adonisjs/bouncer/types'

export default class ColumnPolicy extends BasePolicy {
    show(userId: string, column: Column): AuthorizerResponse {
        return column.userId === userId
    }

    update(userId: string, column: Column): AuthorizerResponse {
        return column.userId === userId
    }
}
