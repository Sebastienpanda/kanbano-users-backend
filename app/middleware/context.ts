declare module '@adonisjs/core/http' {
    interface HttpContext {
        userId?: string
        user?: any
        accessToken?: string
    }
}
