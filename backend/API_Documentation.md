# API Documentation for Postman Testing

## Base URL
- Development: `http://localhost:3000`
- API Prefix: `/api/v1`

## Postman Setup
1. Import `postman_collection.json`.
2. Set collection/environment variables: `baseUrl`, `token`, `adminToken`, `conceptId`, `noteId`, `userId`.
3. Run auth flow first (`register`, `login`) and store the returned token.
4. Use `adminToken` only for admin routes.

## Standard Response Format
Success response:
```json
{
  "success": true,
  "message": "...",
  "data": {},
  "meta": {
    "timestamp": "2026-05-28T00:00:00.000Z"
  }
}
```
Error response:
```json
{
  "success": false,
  "message": "...",
  "errors": null,
  "meta": {
    "timestamp": "2026-05-28T00:00:00.000Z"
  }
}
```

## Authentication
- Protected routes: `Authorization: Bearer {{token}}`
- Admin routes: `Authorization: Bearer {{adminToken}}`
- Get user token from `POST /api/v1/auth/login`.
- For admin token, login with an admin user (register with `role: "admin"` in this test setup).

## Key Request Bodies
### Register
```json
{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "Pass@1234",
  "role": "user"
}
```
### Login
```json
{
  "email": "john@example.com",
  "password": "Pass@1234"
}
```
### Create Concept (Admin)
```json
{
  "prompt": "Design URL shortener like bit.ly",
  "response": "Use API layer, key generation, DB sharding, and cache...",
  "metadata": {
    "category": "Foundations",
    "subcategory": "Scalability",
    "concept": "URL Shortener",
    "question_type": "system-design",
    "difficulty": "intermediate",
    "languages": [
      "NodeJS",
      "Go"
    ],
    "cloud_platforms": [
      "AWS"
    ],
    "technologies": [
      "Redis",
      "MongoDB"
    ],
    "patterns_covered": [
      "Caching",
      "Sharding"
    ]
  }
}
```
### Bulk Create Concepts (Admin)
```json
{
  "concepts": [
    {
      "prompt": "Design chat app",
      "response": "Use WebSocket and pub/sub",
      "metadata": {
        "category": "Real-time Systems",
        "subcategory": "Messaging",
        "concept": "Chat Architecture",
        "difficulty": "intermediate"
      }
    }
  ]
}
```
### Add Note
```json
{
  "content": "Important tradeoff: consistency vs availability."
}
```
### Vote
```json
{
  "voteType": "up"
}
```

## Endpoint Catalog

### Health
| Method | Endpoint | Auth | Notes |
|---|---|---|---|
| GET | `/api/v1/health` | Public | - |

### Auth
| Method | Endpoint | Auth | Notes |
|---|---|---|---|
| POST | `/api/v1/auth/forgot-password` | Bearer | Has example body in collection |
| POST | `/api/v1/auth/login` | Public | Has example body in collection |
| POST | `/api/v1/auth/logout` | Public | - |
| DELETE | `/api/v1/auth/profile` | Bearer | - |
| GET | `/api/v1/auth/profile` | Bearer | - |
| PATCH | `/api/v1/auth/profile` | Bearer | Has example body in collection |
| POST | `/api/v1/auth/refresh-token` | Public | Has example body in collection |
| POST | `/api/v1/auth/register` | Public | Has example body in collection |
| POST | `/api/v1/auth/reset-password` | Bearer | Has example body in collection |
| POST | `/api/v1/auth/verify-email` | Bearer | Has example body in collection |

### Concepts
| Method | Endpoint | Auth | Notes |
|---|---|---|---|
| GET | `/api/v1/concepts` | Public | Query example: `?page=1&limit=10&sort=-createdAt` |
| POST | `/api/v1/concepts` | Admin | Query example: `?page=1&limit=10&sort=-createdAt` |
| DELETE | `/api/v1/concepts/:id` | Admin | - |
| GET | `/api/v1/concepts/:id` | Public | - |
| PATCH | `/api/v1/concepts/:id` | Admin | Has example body in collection |
| PUT | `/api/v1/concepts/:id` | Admin | Has example body in collection |
| PATCH | `/api/v1/concepts/:id/archive` | Admin | - |
| GET | `/api/v1/concepts/:id/history` | Public | - |
| GET | `/api/v1/concepts/:id/related` | Public | - |
| PATCH | `/api/v1/concepts/:id/restore` | Admin | - |
| GET | `/api/v1/concepts/:id/summary` | Public | - |
| PATCH | `/api/v1/concepts/bulk/archive` | Admin | Has example body in collection |
| POST | `/api/v1/concepts/bulk/create` | Admin | Has example body in collection |
| DELETE | `/api/v1/concepts/bulk/delete` | Admin | Has example body in collection |
| PATCH | `/api/v1/concepts/bulk/restore` | Admin | Has example body in collection |
| PATCH | `/api/v1/concepts/bulk/update` | Admin | Has example body in collection |
| GET | `/api/v1/concepts/latest` | Public | Query example: `?page=1&limit=5` |
| GET | `/api/v1/concepts/popular` | Public | Query example: `?page=1&limit=10` |
| GET | `/api/v1/concepts/random` | Public | - |
| GET | `/api/v1/concepts/trending` | Public | Query example: `?page=1&limit=10` |

### Bookmarks
| Method | Endpoint | Auth | Notes |
|---|---|---|---|
| GET | `/api/v1/bookmarks/bookmarks` | Bearer | - |
| DELETE | `/api/v1/bookmarks/bookmarks/:conceptId` | Bearer | - |
| POST | `/api/v1/bookmarks/bookmarks/:conceptId` | Bearer | - |
| GET | `/api/v1/bookmarks/notes/:conceptId` | Bearer | - |
| POST | `/api/v1/bookmarks/notes/:conceptId` | Bearer | Has example body in collection |
| DELETE | `/api/v1/bookmarks/notes/:noteId` | Bearer | - |
| PATCH | `/api/v1/bookmarks/notes/:noteId` | Bearer | Has example body in collection |
| POST | `/api/v1/bookmarks/votes/:conceptId` | Bearer | Has example body in collection |
| GET | `/api/v1/bookmarks/votes/top` | Public | - |

### Search
| Method | Endpoint | Auth | Notes |
|---|---|---|---|
| GET | `/api/v1/search` | Public | Query example: `?q=redis&page=1&limit=20` |
| GET | `/api/v1/search/autocomplete` | Public | Query example: `?q=load` |
| GET | `/api/v1/search/category` | Public | Query example: `?q=foundations` |
| GET | `/api/v1/search/content` | Public | Query example: `?q=partition` |
| GET | `/api/v1/search/difficulty` | Public | Query example: `?q=advanced` |
| GET | `/api/v1/search/exact` | Public | Query example: `?q=Design%20a%20URL%20shortener` |
| GET | `/api/v1/search/fuzzy` | Public | Query example: `?q=kafaka` |
| GET | `/api/v1/search/language` | Public | Query example: `?q=go` |
| GET | `/api/v1/search/patterns` | Public | Query example: `?q=circuit-breaker` |
| GET | `/api/v1/search/popular` | Public | Query example: `?limit=10` |
| GET | `/api/v1/search/recent` | Public | Query example: `?limit=10` |
| GET | `/api/v1/search/regex` | Public | Query example: `?pattern=cache.*write` |
| GET | `/api/v1/search/tags` | Public | Query example: `?q=microservices` |
| GET | `/api/v1/search/title` | Public | Query example: `?q=kafka` |
| GET | `/api/v1/search/voice` | Public | Query example: `?q=explain%20what%20is%20consistent%20hashing` |

### Filter
| Method | Endpoint | Auth | Notes |
|---|---|---|---|
| GET | `/api/v1/filter/backend` | Public | - |
| GET | `/api/v1/filter/bookmarks` | Bearer | - |
| GET | `/api/v1/filter/category` | Public | Query example: `?name=Foundations` |
| GET | `/api/v1/filter/cloud` | Public | - |
| GET | `/api/v1/filter/date` | Public | Query example: `?after=2026-01-01` |
| GET | `/api/v1/filter/devops` | Public | - |
| GET | `/api/v1/filter/difficulty` | Public | Query example: `?level=advanced` |
| GET | `/api/v1/filter/expert-only` | Public | - |
| GET | `/api/v1/filter/frontend` | Public | - |
| GET | `/api/v1/filter/language` | Public | Query example: `?name=Go` |
| GET | `/api/v1/filter/pattern` | Public | Query example: `?name=Circuit%20Breaker` |
| GET | `/api/v1/filter/popular` | Public | - |
| GET | `/api/v1/filter/tags` | Public | Query example: `?list=redis,kafka` |
| GET | `/api/v1/filter/trending` | Public | - |
| GET | `/api/v1/filter/unexplored` | Public | - |

### Admin
| Method | Endpoint | Auth | Notes |
|---|---|---|---|
| DELETE | `/api/v1/admin/cache/clear` | Admin | - |
| GET | `/api/v1/admin/logs` | Admin | - |
| GET | `/api/v1/admin/system/health` | Admin | - |
| GET | `/api/v1/admin/system/logs` | Admin | - |
| POST | `/api/v1/admin/system/maintenance` | Admin | - |
| GET | `/api/v1/admin/users` | Admin | - |
| GET | `/api/v1/admin/users/:id` | Admin | - |
| PATCH | `/api/v1/admin/users/:id/ban` | Admin | - |
| PATCH | `/api/v1/admin/users/:id/role` | Admin | Has example body in collection |
| PATCH | `/api/v1/admin/users/:id/unban` | Admin | - |

### Analytics
| Method | Endpoint | Auth | Notes |
|---|---|---|---|
| GET | `/api/v1/analytics/api-performance` | Public | - |
| GET | `/api/v1/analytics/bookmarks/top` | Public | Query example: `?limit=10` |
| GET | `/api/v1/analytics/cache-hit-rate` | Public | - |
| GET | `/api/v1/analytics/category-distribution` | Public | - |
| GET | `/api/v1/analytics/database-performance` | Public | - |
| GET | `/api/v1/analytics/difficulty-stats` | Public | - |
| GET | `/api/v1/analytics/engagement` | Public | - |
| GET | `/api/v1/analytics/growth` | Public | - |
| GET | `/api/v1/analytics/languages/top` | Public | Query example: `?limit=10` |
| GET | `/api/v1/analytics/patterns/top` | Public | Query example: `?limit=10` |
| GET | `/api/v1/analytics/searches/failed` | Public | - |
| GET | `/api/v1/analytics/searches/top` | Public | - |
| GET | `/api/v1/analytics/total-concepts` | Public | - |
| GET | `/api/v1/analytics/trending` | Public | - |
| GET | `/api/v1/analytics/views/top` | Public | Query example: `?limit=10` |

### Categories
| Method | Endpoint | Auth | Notes |
|---|---|---|---|
| GET | `/api/v1/categories` | Public | Query example: `?page=1&limit=20` |
| GET | `/api/v1/categories/:category` | Public | - |
| GET | `/api/v1/categories/:category/concepts` | Public | - |
| GET | `/api/v1/categories/architectures/microservices` | Public | - |
| GET | `/api/v1/categories/difficulty` | Public | - |
| GET | `/api/v1/categories/difficulty/:level` | Public | - |
| GET | `/api/v1/categories/languages` | Public | - |
| GET | `/api/v1/categories/languages/:language` | Public | - |
| GET | `/api/v1/categories/patterns` | Public | Query example: `?page=1&limit=20` |
| GET | `/api/v1/categories/patterns/:patternName` | Public | - |
| GET | `/api/v1/categories/question-types` | Public | - |
| GET | `/api/v1/categories/question-types/:type` | Public | - |
| GET | `/api/v1/categories/subcategories` | Public | - |
| GET | `/api/v1/categories/tags` | Public | - |
| GET | `/api/v1/categories/tags/:tag` | Public | - |

### Discovery
| Method | Endpoint | Auth | Notes |
|---|---|---|---|
| GET | `/api/v1/discovery/daily-challenge` | Public | - |
| GET | `/api/v1/discovery/expert-picks` | Public | - |
| GET | `/api/v1/discovery/hidden-gems` | Public | - |
| GET | `/api/v1/discovery/recommended/:userId` | Public | - |
| GET | `/api/v1/discovery/roadmap/backend` | Public | - |
| GET | `/api/v1/discovery/roadmap/devops` | Public | - |
| GET | `/api/v1/discovery/roadmap/frontend` | Public | - |
| GET | `/api/v1/discovery/roadmap/system-design` | Public | - |
| GET | `/api/v1/discovery/suggest-next/:id` | Public | - |
| GET | `/api/v1/discovery/trending` | Public | - |

### System
| Method | Endpoint | Auth | Notes |
|---|---|---|---|
| GET | `/api/v1/system/cache/status` | Public | - |
| GET | `/api/v1/system/config` | Public | - |
| GET | `/api/v1/system/database/status` | Public | - |
| POST | `/api/v1/system/reindex` | Admin | - |
| POST | `/api/v1/system/restart` | Admin | - |
| GET | `/api/v1/system/status` | Public | - |
| GET | `/api/v1/system/storage/status` | Public | - |
| GET | `/api/v1/system/uptime` | Public | - |
| GET | `/api/v1/system/version` | Public | - |

### Errors
| Method | Endpoint | Auth | Notes |
|---|---|---|---|
| GET | `/api/v1/errors/database` | Public | - |
| GET | `/api/v1/errors/not-found` | Public | - |
| GET | `/api/v1/errors/server-error` | Public | - |
| GET | `/api/v1/errors/token-expired` | Public | - |
| GET | `/api/v1/errors/validation` | Public | - |

### Validate
| Method | Endpoint | Auth | Notes |
|---|---|---|---|
| POST | `/api/v1/validate/concept` | Public | Has example body in collection |
| PATCH | `/api/v1/validate/concept/:id` | Public | Has example body in collection |
| GET | `/api/v1/validate/errors/database` | Public | - |
| GET | `/api/v1/validate/errors/not-found` | Public | - |
| GET | `/api/v1/validate/errors/server-error` | Public | - |
| GET | `/api/v1/validate/errors/token-expired` | Public | - |
| GET | `/api/v1/validate/errors/validation` | Public | - |
| POST | `/api/v1/validate/search` | Public | Has example body in collection |
| POST | `/api/v1/validate/tags` | Public | Has example body in collection |
| POST | `/api/v1/validate/upload` | Public | Has example body in collection |

### Middleware
| Method | Endpoint | Auth | Notes |
|---|---|---|---|
| GET | `/api/v1/middleware/admin/protected/dashboard` | Admin | - |
| GET | `/api/v1/middleware/middleware/auth` | Bearer | - |
| GET | `/api/v1/middleware/middleware/cache` | Public | - |
| GET | `/api/v1/middleware/middleware/compression` | Public | - |
| GET | `/api/v1/middleware/middleware/logger` | Public | - |
| GET | `/api/v1/middleware/middleware/rate-limit` | Public | - |
| GET | `/api/v1/middleware/protected/concepts` | Bearer | - |
| POST | `/api/v1/middleware/protected/concepts` | Bearer | - |
| DELETE | `/api/v1/middleware/protected/concepts/:id` | Bearer | - |
| PATCH | `/api/v1/middleware/protected/concepts/:id` | Bearer | - |

## Suggested Testing Order
1. `GET /api/v1/health`
2. `POST /api/v1/auth/register`
3. `POST /api/v1/auth/login`
4. Set `token` from login response
5. Test public concept/search/filter endpoints
6. Test protected bookmark/note/vote endpoints
7. Login as admin, set `adminToken`, then test admin and concept write endpoints

## Known Route Naming Note
- Because `bookmarkNoteRoutes` is mounted at `/api/v1/bookmarks`, some paths are intentionally double-segmented, e.g. `GET /api/v1/bookmarks/bookmarks` and `POST /api/v1/bookmarks/notes/:conceptId`.
- In the current `authRoutes` file order, `POST /api/v1/auth/forgot-password`, `POST /api/v1/auth/reset-password`, and `POST /api/v1/auth/verify-email` execute after `router.use(protect)` and therefore require a Bearer token at runtime.
