import type { HttpContext } from '@adonisjs/core/http'

export default class TasksController {
    async index({}: HttpContext) {}

    async store({ request }: HttpContext) {}

    async show({ params }: HttpContext) {}

    async update({ params, request }: HttpContext) {}
}
