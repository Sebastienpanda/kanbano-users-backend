import Workspace from '#models/workspace'
import { CreateWorkspaceDto, UpdateWorkspaceDto } from '#dto/create_workspace_dto'
import { DbClaimService } from '#services/db_claim_service'
import { inject } from '@adonisjs/core'

@inject()
export default class WorkspacesRepository {
    constructor(private readonly dbClaimService: DbClaimService) {}

    async findAll(userId: string): Promise<Workspace[]> {
        return this.dbClaimService.runWithClaims({ sub: userId }, async (trx) => {
            return Workspace.query({ client: trx }).orderBy('createdAt', 'desc')
        })
    }

    async create(data: CreateWorkspaceDto, userId: string): Promise<Workspace> {
        return this.dbClaimService.runWithClaims({ sub: userId }, async (trx) => {
            return Workspace.create({ name: data.name }, { client: trx })
        })
    }

    async findById(workspaceId: string, userId: string) {
        return this.dbClaimService.runWithClaims({ sub: userId }, async (trx) => {
            return Workspace.query({ client: trx }).where('id', workspaceId).first()
        })
    }

    async update(
        workspaceId: string,
        userId: string,
        data: UpdateWorkspaceDto
    ): Promise<Workspace | null> {
        return this.dbClaimService.runWithClaims({ sub: userId }, async (trx) => {
            const workspace = await Workspace.query({ client: trx })
                .where('id', workspaceId)
                .first()

            if (!workspace) return null

            workspace.useTransaction(trx)

            workspace.merge({ name: data.name })
            await workspace.save()

            return workspace
        })
    }
}
