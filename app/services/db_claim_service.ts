import db from '@adonisjs/lucid/services/db'
import { TransactionClientContract } from '@adonisjs/lucid/types/database'

export class DbClaimService {
    async runWithClaims<T>(
        claims: Record<string, unknown>,
        fn: (trx: TransactionClientContract) => Promise<T>
    ): Promise<T> {
        return db.transaction(async (trx) => {
            await trx.rawQuery(`select set_config('request.jwt.claims', ?, true)`, [
                JSON.stringify(claims),
            ])

            return fn(trx)
        })
    }
}
