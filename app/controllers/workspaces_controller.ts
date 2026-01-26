import type { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'
import WorkspacesRepository from '../repository/workspaces.repository.js'

@inject()
export default class WorkspacesController {
    constructor(private readonly workspacesRepository: WorkspacesRepository) {}

    async index({ userId, response }: HttpContext) {
        const workspaces = await this.workspacesRepository.findAll(userId!)
        return response.ok({
            data: workspaces,
        })
    }

    /**
     * Display form to create a new record
     */
    async create({}: HttpContext) {}

    /**
     * Show individual record
     */
    async show({}: HttpContext) {}

    /**
     * Handle form submission for the edit action
     */
    async update({}: HttpContext) {}
}
