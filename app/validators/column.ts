import vine from '@vinejs/vine'

export const createColumnValidator = vine.compile(
    vine.object({
        name: vine.string().trim().minLength(1),
    })
)

export const updateColumnValidator = vine.compile(
    vine.object({
        name: vine.string().trim().minLength(1).optional(),
    })
)

export const paramsColumnValidator = vine.compile(
    vine.object({
        params: vine.object({
            workspace_id: vine.string().uuid(),
            id: vine.string().uuid(),
        }),
    })
)

export const paramsWorkspaceValidator = vine.compile(
    vine.object({
        params: vine.object({
            workspace_id: vine.string().uuid(),
        }),
    })
)
