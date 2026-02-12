import app from '@adonisjs/core/services/app'
import { ExceptionHandler, HttpContext } from '@adonisjs/core/http'
import { errors as lucidErrors } from '@adonisjs/lucid'

export default class HttpExceptionHandler extends ExceptionHandler {
    protected debug = !app.inProduction

    async handle(error: unknown, ctx: HttpContext) {
        if (error instanceof lucidErrors.E_ROW_NOT_FOUND) {
            return ctx.response.notFound({
                message: 'Resource not found',
                error: 'RESOURCE_NOT_FOUND',
                statusCode: 404,
            })
        }

        if (error instanceof Error) {
            if (error.message.includes('duplicate key value violates unique constraint')) {
                const match = new RegExp(/unique constraint "(\w+)_(\w+)_(\w+)_unique"/).exec(
                    error.message
                )

                console.log(match)

                if (match) {
                    const table = match[1]
                    const field = match[3]

                    const messages: Record<string, string> = {
                        columns_workspace: `A column with this ${field} already exists in this workspace`,
                        tasks: `A task with this ${field} already exists in this column`,
                        workspaces_user: `A workspace with this ${field} already exists for this user`,
                    }

                    const message = messages[table] || `This ${field} already exists`

                    return ctx.response.conflict({
                        message,
                        error: 'DUPLICATE_RESOURCE',
                        field,
                        statusCode: 409,
                    })
                }
            }
        }

        return super.handle(error, ctx)
    }

    async report(error: unknown, ctx: HttpContext) {
        return super.report(error, ctx)
    }
}
