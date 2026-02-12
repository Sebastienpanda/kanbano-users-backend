export type CreateColumnDto = {
    name: string
    workspaceId: string
    userId: string
}

export type UpdateColumnDto = {
    name?: string
    position?: number
}
