import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
    async up() {
        await this.schema.raw(`
      create or replace function public.auth_uid()
      returns uuid
      language sql
      stable
      as $$
        select nullif(
          (current_setting('request.jwt.claims', true)::jsonb ->> 'sub'),
          ''
        )::uuid;
      $$;
    `)
    }

    async down() {
        await this.schema.raw(`drop function if exists public.auth_uid();`)
    }
}
