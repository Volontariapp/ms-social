# Microservice Social (ms-social)

## Project Overview & Value Proposition

Le microservice **`ms-social`** gère le tissu conjonctif de la communauté Volontariapp. Il se concentre sur les graphes sociaux : connexions (amis), abonnements (followers) et recommandations.

Contrairement aux autres microservices s'appuyant sur PostgreSQL, `ms-social` se distingue par son choix de base de données primaire orientée graphe : **Neo4j**. Cette décision technologique lui permet d'optimiser radicalement la traversée des nœuds et la détection de relations au second degré ou plus ("Amis d'amis"). Il maintient une architecture standardisée gRPC et délègue son métier au paquet `@volontariapp/domain-social`.

## Key Features

- **Graphe Social** : Suivi des relations (Followers/Following, Connexions, Recommandations).
- **Technologie Graphe (Neo4j)** : Requêtes Cypher pour analyser les connexions avec des performances optimales.
- **Interface Contract-First (gRPC)** : Communication binaire haute performance depuis l'API Gateway.
- **Sécurité Centralisée** : Authentification et RBAC résolus en amont et relayés par un Token Interne.
- **Event-Driven via Outbox** : Pattern Outbox implémenté pour propager la création de nouvelles connexions asynchrones.

## Tech Stack & Dependencies

| Composant                 | Technologie                     | Usage / Rôle                                             |
| :------------------------ | :------------------------------ | :------------------------------------------------------- |
| **Framework Base**        | NestJS                          | Inversion de contrôle, architecture standardisée.        |
| **Logique Métier**        | `@volontariapp/domain-social`   | Paquet interne avec les noeuds et arêtes DDD.            |
| **Persistance Graphe**    | **Neo4j**                       | Base de données optimisée pour les graphes et relations. |
| **Messagerie Asynchrone** | BullMQ / `@volontariapp/outbox` | Distribution événementielle via RabbitMQ/Kafka.          |
| **Communication RPC**     | gRPC (`@grpc/grpc-js`)          | Endpoints pour la gestion du graphe de l'utilisateur.    |

## Getting Started

### Prérequis

- **Node.js** (>= 24.14.0)
- **Package Manager** : Yarn v4 (`corepack enable`)
- Infrastructure locale accessible : Redis et une instance **Neo4j** locale/Docker (avec le bon mot de passe configuré).

### Installation & Exécution

```bash
cd ms-social
yarn install

# Lancement en mode développement avec Hot-Reload
yarn start:dev
```

_(Note : Assurez-vous que l'instance Neo4j possède la base de données et les contraintes d'unicité adéquates pré-configurées ou migrées via les scripts internes de `domain-social`)_.

## Testing & CI/CD

Les tests E2E, gérés via `ci-tools`, intègrent des conteneurs Neo4j éphémères garantissant une isolation totale par exécution, permettant de vérifier la justesse des requêtes Cypher complexes. Le CI/CD repose sur GitHub Actions pour valider la génération des images OCI déployées sur Kubernetes.
