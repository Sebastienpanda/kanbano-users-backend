import { BasePolicy } from '@adonisjs/bouncer'
import { AuthorizerResponse } from '@adonisjs/bouncer/types'

export default class WorkspacePolicy extends BasePolicy {
    viewList(): AuthorizerResponse {
        return true
    }
}
