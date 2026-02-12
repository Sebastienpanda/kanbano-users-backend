import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'

const TasksController = () => import('#controllers/tasks_controller')

const ColumnsController = () => import('#controllers/columns_controller')

const WorkspacesController = () => import('#controllers/workspaces_controller')

router
    .group(() => {
        router.resource('workspaces', WorkspacesController).apiOnly().except(['destroy'])
        router.resource('workspaces.columns', ColumnsController).apiOnly().except(['destroy'])
        router.resource('columns.tasks', TasksController).apiOnly().except(['index', 'destroy'])
    })
    .prefix('/api/v1')
    .use(middleware.auth())
