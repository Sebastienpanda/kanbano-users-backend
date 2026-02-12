# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Backend API pour Kanbano, une application de gestion de tâches de type Kanban. Construit avec AdonisJS 6, utilise PostgreSQL comme base de données.

## Commands

### Development
- `npm run dev` - Lance le serveur de développement avec Hot Module Replacement
- `npm run start` - Lance le serveur en production
- `npm run build` - Build l'application pour la production

### Testing
- `npm run test` - Lance tous les tests
- Tests unitaires: fichiers dans `tests/unit/**/*.spec.ts` (timeout: 2s)
- Tests fonctionnels: fichiers dans `tests/functional/**/*.spec.ts` (timeout: 30s)

### Code Quality
- `npm run lint` - Vérifie le code avec ESLint
- `npm run format` - Formate le code avec Prettier
- `npm run typecheck` - Vérifie les types TypeScript sans compiler

### Database
- `node ace migration:run` - Exécute les migrations
- `node ace migration:rollback` - Rollback la dernière migration
- `node ace db:seed` - Exécute les seeders

## Architecture

### Authentication Flow
L'authentification utilise **JWT externe avec JWKS** (pas de gestion locale des utilisateurs):
- `AuthMiddleware` vérifie les tokens JWT via un endpoint JWKS distant (EdDSA algorithm)
- Le token est validé et le `userId` est extrait du payload (`sub` ou `id`)
- `ctx.userId`, `ctx.user` et `ctx.accessToken` sont injectés dans le contexte HTTP
- Les utilisateurs ne sont PAS stockés dans cette base de données - seul le `userId` est utilisé comme clé étrangère

### Authorization with Bouncer
- `InitializeBouncerMiddleware` initialise Bouncer pour chaque requête
- L'autorisation utilise `ctx.userId` (string) plutôt qu'un objet User complet
- Les policies reçoivent directement le `userId` comme premier paramètre
- Pattern: `policy.method(userId: string, resource: Model): AuthorizerResponse`
- Exemple: `WorkspacePolicy.show(userId, workspace)` vérifie que `workspace.userId === userId`

### Data Layer Pattern
Architecture en 3 couches:
1. **Controllers** - Validation, orchestration, réponses HTTP
2. **Repositories** - Logique d'accès aux données (pattern Repository)
3. **Models** - Entités Lucid ORM avec relations

Les repositories encapsulent toutes les requêtes de base de données. Controllers appellent les repositories, jamais les models directement.

### Resource Structure
Hiérarchie des ressources Kanban:
- `Workspace` (appartient à un userId externe)
  - `Column` (appartient à un Workspace)
    - `Task` (appartient à une Column)

Routes API RESTful imbriquées:
- `/api/v1/workspaces` - CRUD des workspaces
- `/api/v1/workspaces/:id/columns` - CRUD des colonnes dans un workspace
- `/api/v1/columns/:id/tasks` - CRUD des tâches dans une colonne

### Middleware Stack
1. **Server-level** (toutes les requêtes):
   - `container_bindings_middleware`
   - `force_json_response_middleware`
   - `@adonisjs/cors/cors_middleware`

2. **Router-level** (routes enregistrées):
   - `@adonisjs/core/bodyparser_middleware`
   - `initialize_bouncer_middleware` (configure Bouncer)

3. **Named middleware**:
   - `auth` - Validation JWT (appliqué au groupe `/api/v1`)

### Path Aliases
Le projet utilise des imports alias définis dans `package.json`:
- `#controllers/*` → `./app/controllers/*.js`
- `#models/*` → `./app/models/*.js`
- `#middleware/*` → `./app/middleware/*.js`
- `#policies/*` → `./app/policies/*.js`
- `#abilities/*` → `./app/abilities/*.js`
- `#validators/*` → `./app/validators/*.js`
- `#start/*` → `./start/*.js`
- `#config/*` → `./config/*.js`

Toujours utiliser ces alias plutôt que des chemins relatifs.

### Environment Variables
Variables critiques requises:
- `JWKS_URL` - URL du endpoint JWKS pour la validation JWT
- `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_DATABASE` - Configuration PostgreSQL
- La connexion PostgreSQL nécessite SSL (`ssl: true`)

## Key Patterns

### Creating Resources with Authorization
Lors de la création de ressources appartenant à un user:
```typescript
// Controller
async store({ request, bouncer }: HttpContext) {
  const data = await request.validateUsing(validator)
  await bouncer.authorize('create' as never)
  const resource = await repository.create({ ...data, userId })
  return response.created(resource)
}
```

### Nested Resource Controllers
Pour les ressources imbriquées (ex: columns dans workspaces):
- Le parent ID vient des params de route
- Autoriser l'accès au parent avant de créer l'enfant
- Associer l'enfant au parent lors de la création

### Policy Authorization
Les policies reçoivent `userId: string` comme premier paramètre (pas un objet User):
```typescript
export default class ResourcePolicy extends BasePolicy {
  show(userId: string, resource: Resource): AuthorizerResponse {
    return resource.userId === userId
  }
}
```
