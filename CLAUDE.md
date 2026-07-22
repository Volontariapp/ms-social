## Domaine ms-social

Le domaine métier réel vit dans le package partagé `@volontariapp/domain-social`
(`npm-packages/packages/domain-social`), consommé ici via les modules NestJS sous
`src/modules/*`. ms-social ne possède pas les entités métier complètes (users, posts,
events) : il ne stocke que des noeuds-miroirs (`SocialUser`, `SocialPost`, `SocialEvent`,
chacun réduit à un simple id) et les relations entre eux dans Neo4j. Les données riches
(contenu des posts, profils, détails d'event) appartiennent à d'autres microservices.

Modules / agrégats gérés :

- `user-node` : existence des noeuds `SocialUser` (créés/supprimés en écho à ms-identity)
- `relationship` : `FOLLOW`, `BLOCK` entre `SocialUser`
- `publication` : noeuds `SocialPost`, relation `CREATED` (ownership) entre user et post
- `interaction` : relation `LIKE` entre user et post
- `participation` : noeuds `SocialEvent`, relations `CREATED`, `PARTICIPATE`,
  `WISH_TO_PARTICIPATE` entre user et event
- `event-post-link` : relation `POSTED_AT`/lien post <-> event (`LinkPostToEvent`)

Invariants appliqués côté `services/*.service.ts` (domain-social) : toute création
vérifie l'inexistence préalable (`*_ALREADY_EXISTS`), toute suppression vérifie
l'existence (`*_NOT_FOUND`) avant d'écrire dans Neo4j — les repositories Cypher
utilisent `MERGE`/`DELETE` mais le service ajoute ces garde-fous applicatifs.
Aucune règle anti self-follow/self-block n'est visible dans le code.

## Outbox / événements

Le schéma partagé Postgres (`EventQueueEntity`, `JobsOutboxEntity`, `JobAuditModel` de
`@volontariapp/database`) est enregistré dans `src/config/data-source.ts` et
`src/providers/database/database.module.ts` uniquement pour les migrations communes
(`src/migrations/common/*`). Aucun code applicatif dans `src/` ne lit ni n'écrit dans
ces tables (pas de producteur outbox, pas de worker/consumer BullMQ trouvé). ms-social
semble donc purement réactif : ses gRPC command controllers sont appelés
synchroniquement (par une saga/orchestrateur ou un autre service) suite à des
événements métier ailleurs (ex: création de compte, création de post/event), sans
émettre lui-même d'événements de domaine.

## Neo4j

Chaque repository (`neo4j-*.repository.ts` dans domain-social) écrit des requêtes
Cypher directes via `Neo4jBaseRepository` (helpers `write`, `readOne`, `readPaginated`).
Labels : `SocialUser`, `SocialPost`, `SocialEvent`. Relations : `FOLLOW`, `BLOCK`,
`CREATED`, `PARTICIPATE`, `WISH_TO_PARTICIPATE`, `LIKE`, lien post/event dans
`neo4j-event-post-link.repository.ts`. La requête la plus complexe est
`getRecommendedEventIds` (participation.repository) : construit dynamiquement un
Cypher avec sous-clauses `NOT EXISTS {...}` pour exclure les events créés/participés/
souhaités par l'utilisateur ou par des comptes bloqués, et un match `(u)-[:FOLLOW]->
(friend)-[:FOLLOW]->(u)` pour restreindre aux "amis" (follow réciproque) quand
`onlyParticipatedByFriends`/`onlyWishedByFriends`/`onlyCreatedByFriends` est demandé.

## gRPC exposé

Proto source : `proto-registry/proto/volontariapp/social/social.services.proto`.
Services exposés (chacun avec variante `Admin*` pour agir au nom d'un autre user) :
`SocialUserNodeCommandService`/`QueryService`, `RelationshipCommandService`/
`QueryService` (follow/block), `PublicationCommandService`/`QueryService` (post
ownership + feed), `InteractionCommandService`/`QueryService` (like),
`ParticipationCommandService`/`QueryService` (event create/participate/wish +
`GetRecommendedEventIds`), `EventPostLinkCommandService`/`QueryService` (lien
post-event). Contrôleurs correspondants dans `src/modules/*/controllers/*.controller.ts`
via `@GrpcMethod(GRPC_SERVICES.*, ...)` (constantes `@volontariapp/contracts-nest`).

## Package partagé

`@volontariapp/domain-social` (`npm-packages/packages/domain-social`) contient
entités, value-objects (`UserId`/`PostId`/`EventId`/pagination), mappers, services et
repositories Neo4j. ms-social importe directement ces services (ex: `SocialUserService`,
`RelationshipService`) dans ses controllers gRPC — il n'y a quasiment pas de logique
métier propre à ms-social en dehors du câblage NestJS/gRPC/DTO (class-validator sur
les champs `*Id` en `@IsString()`).

---

## 🚀 RTK - Rust Token Killer (Optimized)

All shell commands (`git`, `npm`, `jest`, etc.) are automatically proxied via `rtk` for 80% token savings.

- **Direct Usage:** `rtk gain` (analytics), `rtk discover` (missed savings).
- **Files:** Use `rtk read <file>`, `rtk ls`, `rtk find`, `rtk grep` for compressed agent output.

## graphify

This project has a knowledge graph at graphify-out/ with god nodes, community structure, and cross-file relationships.

Rules:

- For codebase questions, first run `graphify query "<question>"` when graphify-out/graph.json exists. Use `graphify path "<A>" "<B>"` for relationships and `graphify explain "<concept>"` for focused concepts. These return a scoped subgraph, usually much smaller than GRAPH_REPORT.md or raw grep output.
- If graphify-out/wiki/index.md exists, use it for broad navigation instead of raw source browsing.
- Read graphify-out/GRAPH_REPORT.md only for broad architecture review or when query/path/explain do not surface enough context.
- After modifying code, run `graphify update .` to keep the graph current (AST-only, no API cost).
