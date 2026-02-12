import { createRemoteJWKSet, JWTPayload, jwtVerify } from 'jose'
import env from '#start/env'
import type { HttpContext } from '@adonisjs/core/http'
import { NextFn } from '@adonisjs/core/types/http'

interface CustomJwtPayload extends JWTPayload {
    sub?: string
    id?: string
    email?: string
    [key: string]: any
}

export default class AuthMiddleware {
    private static jwks: ReturnType<typeof createRemoteJWKSet>

    constructor() {
        if (!AuthMiddleware.jwks) {
            const jwksUrl = env.get('JWKS_URL')!
            AuthMiddleware.jwks = createRemoteJWKSet(new URL(jwksUrl))
        }
    }

    async handle(ctx: HttpContext, next: NextFn) {
        const authHeader = ctx.request.header('authorization')

        if (!authHeader) {
            return ctx.response.unauthorized({
                message: 'Missing authentication token',
                error: 'TOKEN_MISSING',
                statusCode: 401,
            })
        }

        const [type, token] = authHeader.split(' ')

        if (type !== 'Bearer' || !token) {
            return ctx.response.unauthorized({
                message: 'Invalid token format',
                error: 'TOKEN_INVALID_FORMAT',
                statusCode: 401,
            })
        }

        try {
            const { payload } = await jwtVerify(token, AuthMiddleware.jwks, {
                algorithms: ['EdDSA'],
            })

            const typedPayload = payload as CustomJwtPayload
            const userId = typedPayload.sub || typedPayload.id

            if (!userId) {
                return ctx.response.unauthorized({
                    message: 'User ID not found in token',
                    error: 'USER_ID_MISSING',
                    statusCode: 401,
                })
            }

            ctx.userId = userId
            ctx.user = typedPayload
            ctx.accessToken = token

            await next()
        } catch (error: unknown) {
            if (error instanceof Error) {
                if (error.message.includes('exp')) {
                    return ctx.response.unauthorized({
                        message: 'Token has expired',
                        error: 'TOKEN_EXPIRED',
                        statusCode: 401,
                    })
                }

                if (error.message.includes('signature')) {
                    return ctx.response.unauthorized({
                        message: 'Invalid token signature',
                        error: 'TOKEN_INVALID_SIGNATURE',
                        statusCode: 401,
                    })
                }

                if (error.message.includes('issuer')) {
                    return ctx.response.unauthorized({
                        message: 'Invalid token issuer',
                        error: 'TOKEN_INVALID_ISSUER',
                        statusCode: 401,
                    })
                }
            }

            return ctx.response.unauthorized({
                message: 'Invalid authentication token',
                error: 'TOKEN_INVALID',
                statusCode: 401,
            })
        }
    }
}
