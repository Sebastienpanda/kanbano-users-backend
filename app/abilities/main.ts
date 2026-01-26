import { Bouncer } from '@adonisjs/bouncer'

export const editUser = Bouncer.ability(() => {
    return true
})
