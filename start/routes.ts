import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'

const WorkspacesController = () => import('#controllers/workspaces_controller')

router
    .group(() => {
        router.resource('workspaces', WorkspacesController).apiOnly()
    })
    .prefix('/api/v1')
    .use(middleware.auth())
