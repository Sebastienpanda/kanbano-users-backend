import vine from '@vinejs/vine'

export const createWorkspaceValidator = vine.compile(
    vine.object({
        name: vine.string().trim().minLength(4),
    })
)

export const updateWorkspaceValidator = vine.compile(
    vine.object({
        name: vine.string().trim().minLength(4),
    })
)

export const paramsWorkspaceValidator = vine.compile(
    vine.object({
        params: vine.object({
            id: vine.string().uuid(),
        }),
    })
)
