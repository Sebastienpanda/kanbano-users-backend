import type { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'
import ColumnsRepository from '#repository/columns.repository'
import WorkspacesRepository from '#repository/workspaces.repository'
import {
    createColumnValidator,
    paramsColumnValidator,
    paramsWorkspaceValidator,
    updateColumnValidator,
} from '#validators/column'
import WorkspacePolicy from '#policies/workspace_policy'
import ColumnPolicy from '#policies/column_policy'

@inject()
export default class ColumnsController {
    constructor(
        private readonly columnsRepository: ColumnsRepository,
        private readonly workspacesRepository: WorkspacesRepository
    ) {}

    async index({ response, request, bouncer }: HttpContext) {
        const { params } = await request.validateUsing(paramsWorkspaceValidator)
        const workspace = await this.workspacesRepository.findById(params.workspace_id)

        if (!workspace) {
            return response.notFound({
                message: 'Workspace not found',
                error: 'WORKSPACE_NOT_FOUND',
                statusCode: 404,
            })
        }

        if (await bouncer.with(WorkspacePolicy).denies('show', workspace)) {
            return response.forbidden({
                message: 'Access denied to this workspace',
                error: 'ACCESS_DENIED',
                statusCode: 403,
            })
        }

        const columns = await this.columnsRepository.findAllByWorkspace(params.workspace_id)

        return response.ok({
            data: columns,
        })
    }

    async store({ response, request, userId, bouncer }: HttpContext) {
        const { params } = await request.validateUsing(paramsWorkspaceValidator)
        const workspace = await this.workspacesRepository.findById(params.workspace_id)

        if (!workspace) {
            return response.notFound({
                message: 'Workspace not found',
                error: 'WORKSPACE_NOT_FOUND',
                statusCode: 404,
            })
        }

        if (await bouncer.with(WorkspacePolicy).denies('show', workspace)) {
            return response.forbidden({
                message: 'Access denied to this workspace',
                error: 'ACCESS_DENIED',
                statusCode: 403,
            })
        }

        const data = request.only(['name'])
        const payload = await createColumnValidator.validate(data)

        const column = await this.columnsRepository.create({
            name: payload.name,
            workspaceId: params.workspace_id,
            userId: userId!,
        })

        return response.created({
            data: column,
        })
    }

    async show({ response, request, bouncer }: HttpContext) {
        const { params } = await request.validateUsing(paramsColumnValidator)
        const column = await this.columnsRepository.findById(params.id)

        if (!column) {
            return response.notFound({
                message: 'Column not found',
                error: 'COLUMN_NOT_FOUND',
                statusCode: 404,
            })
        }

        if (await bouncer.with(ColumnPolicy).denies('show', column)) {
            return response.forbidden({
                message: 'Access denied to this column',
                error: 'ACCESS_DENIED',
                statusCode: 403,
            })
        }

        return response.ok({
            data: column,
        })
    }

    async update({ request, response, bouncer }: HttpContext) {
        const { params } = await request.validateUsing(paramsColumnValidator)
        const column = await this.columnsRepository.findById(params.id)

        if (!column) {
            return response.notFound({
                message: 'Column not found',
                error: 'COLUMN_NOT_FOUND',
                statusCode: 404,
            })
        }

        if (await bouncer.with(ColumnPolicy).denies('update', column)) {
            return response.forbidden({
                message: 'Access denied to update this column',
                error: 'ACCESS_DENIED',
                statusCode: 403,
            })
        }

        const data = request.only(['name'])
        const payload = await updateColumnValidator.validate(data)

        await this.columnsRepository.update(column, payload)

        return response.noContent()
    }
}
