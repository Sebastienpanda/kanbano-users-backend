import Workspace from '#models/workspace'

export default class WorkspacesRepository {
    async findAll(id: string): Promise<Workspace[]> {
        return Workspace.findManyBy('userId', id)
    }
}
