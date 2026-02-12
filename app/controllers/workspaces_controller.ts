import type { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'
import WorkspacesRepository from '#repository/workspaces.repository'
import {
    createWorkspaceValidator,
    paramsWorkspaceValidator,
    updateWorkspaceValidator,
} from '#validators/workspace'

@inject()
export default class WorkspacesController {
    constructor(private readonly workspacesRepository: WorkspacesRepository) {}

    async index({ userId, response }: HttpContext) {
        const workspaces = await this.workspacesRepository.findAll(userId!)
        return response.ok({
            data: workspaces,
        })
    }

    async store({ response, request, userId }: HttpContext) {
        const data = request.only(['name'])
        const payload = await createWorkspaceValidator.validate(data)

        const workspace = await this.workspacesRepository.create(
            {
                name: payload.name,
            },
            userId!
        )

        return response.created({
            data: workspace,
        })
    }

    async show({ response, request, userId }: HttpContext) {
        const { params } = await request.validateUsing(paramsWorkspaceValidator)
        const workspace = await this.workspacesRepository.findById(params.id, userId!)

        return response.ok({
            data: workspace,
        })
    }

    async update({ request, response, userId }: HttpContext) {
        const { params } = await request.validateUsing(paramsWorkspaceValidator)

        const data = request.only(['name'])

        const payload = await updateWorkspaceValidator.validate(data)

        await this.workspacesRepository.update(params.id, userId!, payload)

        return response.noContent()
    }
}
