import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Workspace from '#models/workspace'

export default class extends BaseSeeder {
    async run() {
        await Workspace.createMany([
            {
                name: 'Toto',
                userId: 'e8e3b833-4158-4c8a-95da-11d3ad565f3a',
            },
            {
                name: 'Tata',
                userId: 'e8e3b833-4158-4c8a-95da-11d3ad565f3a',
            },
        ])
    }
}
