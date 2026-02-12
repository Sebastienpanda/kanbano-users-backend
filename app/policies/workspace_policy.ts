import { BasePolicy } from '@adonisjs/bouncer'
import Workspace from '#models/workspace'
import { AuthorizerResponse } from '@adonisjs/bouncer/types'

export default class WorkspacePolicy extends BasePolicy {
    show(userId: string, workspace: Workspace): AuthorizerResponse {
        return workspace.userId === userId
    }

    update(userId: string, workspace: Workspace): AuthorizerResponse {
        return workspace.userId === userId
    }
}
