# Architecture Documentation

## System Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         Client Layer                            │
│  ┌──────────────────┐              ┌─────────────────────────┐  │
│  │   User Browser   │              │   Admin Browser         │  │
│  │  (Next.js App)   │              │   (Next.js Admin)       │  │
│  └────────┬─────────┘              └──────────┬──────────────┘  │
└───────────┼────────────────────────────────────┼─────────────────┘
            │                                    │
            │ HTTP/HTTPS                         │ HTTP/HTTPS
            │                                    │
┌───────────▼────────────────────────────────────▼─────────────────┐
│                      Presentation Layer                          │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │              Next.js 14 Frontend (Port 3000)             │   │
│  │  ┌─────────────┐  ┌──────────┐  ┌─────────────────────┐ │   │
│  │  │ Auth Pages  │  │ Chat UI  │  │   Admin Panel       │ │   │
│  │  │ - Login     │  │ - Sidebar│  │   - User Mgmt       │ │   │
│  │  │ - Register  │  │ - Chat   │  │   - Model Mgmt      │ │   │
│  │  └─────────────┘  └──────────┘  │   - Usage Logs      │ │   │
│  │                                  └─────────────────────┘ │   │
│  │  ┌──────────────────────────────────────────────────────┐│   │
│  │  │ State Management (Zustand)                           ││   │
│  │  │ - Auth Store - User State - UI State                ││   │
│  │  └──────────────────────────────────────────────────────┘│   │
│  └──────────────────────────────────────────────────────────┘   │
└───────────┬──────────────────────────────────────────────────────┘
            │
            │ REST API (Axios)
            │
┌───────────▼──────────────────────────────────────────────────────┐
│                      Application Layer                           │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │              NestJS Backend (Port 3001)                  │   │
│  │                                                           │   │
│  │  ┌────────────┐  ┌─────────────┐  ┌──────────────────┐  │   │
│  │  │   Auth     │  │    Users    │  │   Conversations  │  │   │
│  │  │  Module    │  │   Module    │  │     Module       │  │   │
│  │  └────────────┘  └─────────────┘  └──────────────────┘  │   │
│  │                                                           │   │
│  │  ┌────────────┐  ┌─────────────┐  ┌──────────────────┐  │   │
│  │  │   Chat     │  │  AI Models  │  │      Admin       │  │   │
│  │  │  Module    │  │   Module    │  │     Module       │  │   │
│  │  └────────────┘  └─────────────┘  └──────────────────┘  │   │
│  │                                                           │   │
│  │  ┌──────────────────────────────────────────────────┐    │   │
│  │  │              Common Layer                        │    │   │
│  │  │  - JWT Guards  - Role Guards  - Decorators       │    │   │
│  │  └──────────────────────────────────────────────────┘    │   │
│  └──────────────────────────────────────────────────────────┘   │
└───────────┬──────────────────────────────┬───────────────────────┘
            │                              │
            │ Prisma ORM                   │ HTTP Client (Axios)
            │                              │
┌───────────▼──────────────────┐  ┌────────▼──────────────────────┐
│     Data Layer               │  │   External Services           │
│  ┌────────────────────────┐  │  │  ┌─────────────────────────┐  │
│  │   PostgreSQL DB        │  │  │  │   Azure OpenAI API      │  │
│  │                        │  │  │  │   - GPT-4               │  │
│  │  Tables:               │  │  │  │   - o3-mini             │  │
│  │  - users               │  │  │  │   - Phi-4               │  │
│  │  - ai_models           │  │  │  └─────────────────────────┘  │
│  │  - conversations       │  │  │                               │
│  │  - messages            │  │  │  ┌─────────────────────────┐  │
│  │  - usage_logs          │  │  │  │  Azure Foundry API      │  │
│  │                        │  │  │  │  (Alternative Provider) │  │
│  └────────────────────────┘  │  │  └─────────────────────────┘  │
└──────────────────────────────┘  └───────────────────────────────┘
```

## Component Breakdown

### Frontend Architecture (Next.js 14)

```
frontend/
├── src/
│   ├── app/                    # Next.js 14 App Router
│   │   ├── layout.tsx         # Root layout
│   │   ├── page.tsx           # Homepage
│   │   ├── login/             # Login route
│   │   ├── register/          # Register route
│   │   ├── app/               # User chat interface
│   │   └── admin/             # Admin panel routes
│   │       ├── page.tsx       # Dashboard
│   │       ├── users/         # User management
│   │       ├── models/        # Model management
│   │       └── logs/          # Usage logs
│   │
│   ├── components/
│   │   ├── chat/              # Chat components
│   │   │   ├── Sidebar.tsx
│   │   │   ├── MessageList.tsx
│   │   │   ├── ChatInput.tsx
│   │   │   └── ModelSelector.tsx
│   │   └── admin/             # Admin components
│   │       └── AdminLayout.tsx
│   │
│   ├── hooks/
│   │   └── useAuth.ts         # Authentication hook
│   │
│   ├── lib/
│   │   ├── api.ts             # API client
│   │   └── store.ts           # Zustand state
│   │
│   └── types/
│       └── index.ts           # TypeScript types
```

### Backend Architecture (NestJS)

```
backend/
├── src/
│   ├── main.ts                # Application entry point
│   ├── app.module.ts          # Root module
│   │
│   ├── auth/                  # Authentication
│   │   ├── auth.module.ts
│   │   ├── auth.service.ts
│   │   ├── auth.controller.ts
│   │   ├── strategies/
│   │   │   └── jwt.strategy.ts
│   │   └── dto/
│   │       └── auth.dto.ts
│   │
│   ├── users/                 # User management
│   │   ├── users.module.ts
│   │   ├── users.service.ts
│   │   ├── users.controller.ts
│   │   └── dto/
│   │
│   ├── ai-models/             # AI model configuration
│   │   ├── ai-models.module.ts
│   │   ├── ai-models.service.ts
│   │   ├── ai-models.controller.ts
│   │   └── dto/
│   │
│   ├── conversations/         # Conversation management
│   │   ├── conversations.module.ts
│   │   ├── conversations.service.ts
│   │   ├── conversations.controller.ts
│   │   └── dto/
│   │
│   ├── chat/                  # Chat with AI
│   │   ├── chat.module.ts
│   │   ├── chat.service.ts    # Azure OpenAI integration
│   │   ├── chat.controller.ts
│   │   └── dto/
│   │
│   ├── admin/                 # Admin operations
│   │   ├── admin.module.ts
│   │   ├── admin.service.ts
│   │   ├── admin.controller.ts
│   │   └── dto/
│   │
│   ├── usage-logs/            # Usage tracking
│   │   ├── usage-logs.module.ts
│   │   ├── usage-logs.service.ts
│   │   └── usage-logs.controller.ts
│   │
│   ├── prisma/                # Database service
│   │   ├── prisma.module.ts
│   │   └── prisma.service.ts
│   │
│   └── common/                # Shared utilities
│       ├── guards/
│       │   ├── jwt-auth.guard.ts
│       │   └── roles.guard.ts
│       └── decorators/
│           ├── current-user.decorator.ts
│           └── roles.decorator.ts
```

## Data Flow Diagrams

### User Chat Flow

```
User → Frontend → Backend → Azure OpenAI → Backend → Frontend → User

1. User sends message in chat UI
2. Frontend calls POST /chat/send with:
   - conversationId
   - content
   - modelId (optional)
3. Backend:
   a. Validates user & conversation
   b. Retrieves AI model config from DB
   c. Fetches conversation history
   d. Calls Azure OpenAI API
   e. Saves user & assistant messages
   f. Logs token usage
4. Backend returns response
5. Frontend displays messages
```

### Authentication Flow

```
User → Frontend → Backend → Database

1. User submits login form
2. Frontend calls POST /auth/login
3. Backend:
   a. Validates credentials
   b. Generates JWT tokens
   c. Returns user + tokens
4. Frontend:
   a. Stores tokens in localStorage
   b. Updates auth state
   c. Redirects to /app or /admin
```

### Admin Panel Flow

```
Admin → Frontend → Backend → Database

1. Admin accesses /admin
2. Frontend checks role (ADMIN required)
3. Admin manages resources:
   - Users: GET/POST/PUT/DELETE /admin/users
   - Models: GET/POST/PUT/DELETE /admin/models
   - Logs: GET /admin/usage-logs
4. Backend validates admin role
5. Backend performs CRUD operations
6. Frontend updates UI
```

## Database Schema

```
┌─────────────────┐
│     users       │
├─────────────────┤
│ id (PK)         │
│ email (unique)  │
│ password        │
│ name            │
│ role            │◄────┐
│ isActive        │     │
│ createdAt       │     │
│ updatedAt       │     │
└────────┬────────┘     │
         │              │
         │              │
         │         ┌────┴──────────┐
         │         │  usage_logs   │
         │         ├───────────────┤
         │         │ id (PK)       │
         │         │ userId (FK)   │
         │         │ modelId (FK)  │
         │         │ promptTokens  │
         │         │ completionTok │
         │         │ totalTokens   │
         │         │ createdAt     │
         │         └───────┬───────┘
         │                 │
         │                 │
┌────────▼────────┐        │
│ conversations   │        │
├─────────────────┤        │
│ id (PK)         │        │
│ title           │        │
│ userId (FK)     │        │
│ modelId (FK)    │◄───────┤
│ createdAt       │        │
│ updatedAt       │        │
└────────┬────────┘        │
         │                 │
         │                 │
┌────────▼────────┐  ┌─────▼────────┐
│   messages      │  │  ai_models   │
├─────────────────┤  ├──────────────┤
│ id (PK)         │  │ id (PK)      │
│ conversationId  │  │ nameDisplay  │
│ role            │  │ provider     │
│ content         │  │ endpointUrl  │
│ tokensUsed      │  │ deployment   │
│ createdAt       │  │ apiKeyEnvVar │
└─────────────────┘  │ temperature  │
                     │ maxTokens    │
                     │ isActive     │
                     └──────────────┘
```

## API Endpoints

### Public Endpoints
- `POST /auth/register` - User registration
- `POST /auth/login` - User login

### Protected Endpoints (JWT Required)
- `GET /users/profile` - Get user profile
- `PATCH /users/profile` - Update profile
- `GET /ai-models/active` - List active models
- `GET /conversations` - List user conversations
- `POST /conversations` - Create conversation
- `GET /conversations/:id` - Get conversation details
- `DELETE /conversations/:id` - Delete conversation
- `POST /chat/send` - Send message to AI

### Admin Endpoints (Admin Role Required)
- `GET /admin/stats` - Dashboard statistics
- `GET /admin/users` - List all users
- `POST /admin/users` - Create user
- `PUT /admin/users/:id` - Update user
- `DELETE /admin/users/:id` - Delete user
- `GET /admin/models` - List all AI models
- `POST /admin/models` - Create AI model
- `PUT /admin/models/:id` - Update AI model
- `DELETE /admin/models/:id` - Delete AI model
- `GET /admin/usage-logs` - Get usage logs

## Security Architecture

### Authentication
- JWT-based authentication
- Access token (short-lived, 1 hour)
- Refresh token (long-lived, 7 days)
- Tokens stored in localStorage

### Authorization
- Role-based access control (RBAC)
- Roles: USER, ADMIN
- Guards: JwtAuthGuard, RolesGuard

### Data Protection
- Passwords hashed with bcrypt (10 rounds)
- API keys stored in environment variables
- Sensitive data excluded from API responses
- CORS configured for specific origins

## Performance Considerations

### Database
- Indexes on foreign keys
- Indexes on frequently queried fields (userId, createdAt)
- Pagination for large datasets

### Caching (Future)
- Redis for session storage
- Cache AI model configurations
- Cache user preferences

### API Optimization
- Lazy loading conversations
- Message pagination (last 20 messages)
- Efficient Prisma queries with selective fields

## Scalability

### Horizontal Scaling
- Stateless backend (can run multiple instances)
- Load balancer distribution
- Session storage in Redis (future)

### Vertical Scaling
- Database connection pooling
- Optimized queries
- CDN for static assets

## Deployment Architecture

### Docker Setup
```
┌─────────────────────────────────────┐
│         Docker Compose              │
│                                     │
│  ┌──────────┐  ┌─────────────────┐ │
│  │ Frontend │  │    Backend      │ │
│  │ (Next.js)│  │    (NestJS)     │ │
│  │ Port 3000│  │    Port 3001    │ │
│  └──────────┘  └─────────────────┘ │
│                         │           │
│                         │           │
│                ┌────────▼────────┐  │
│                │   PostgreSQL    │  │
│                │   Port 5432     │  │
│                └─────────────────┘  │
└─────────────────────────────────────┘
```

### Cloud Deployment (Azure)
```
┌──────────────────────────────────────────────┐
│              Azure Cloud                     │
│                                              │
│  ┌────────────────┐  ┌──────────────────┐   │
│  │  Azure Web App │  │  Azure Web App   │   │
│  │   (Frontend)   │  │   (Backend)      │   │
│  └────────────────┘  └──────────────────┘   │
│                              │               │
│                              │               │
│                   ┌──────────▼────────────┐  │
│                   │  Azure Database for  │  │
│                   │     PostgreSQL       │  │
│                   └──────────────────────┘  │
│                                              │
│  ┌───────────────────────────────────────┐  │
│  │      Azure OpenAI Service             │  │
│  │      - GPT-4 Deployment               │  │
│  │      - API Key Management             │  │
│  └───────────────────────────────────────┘  │
└──────────────────────────────────────────────┘
```

## Technology Stack Summary

| Layer           | Technology        | Purpose                    |
|-----------------|-------------------|----------------------------|
| Frontend        | Next.js 14        | React framework            |
| UI              | TailwindCSS       | Styling                    |
| State Mgmt      | Zustand           | Client state               |
| Backend         | NestJS            | Node.js framework          |
| Database        | PostgreSQL        | Relational database        |
| ORM             | Prisma            | Database abstraction       |
| Auth            | JWT + Passport    | Authentication             |
| AI Integration  | Azure OpenAI      | AI model API               |
| Container       | Docker            | Containerization           |
| Language        | TypeScript        | Type safety                |

## Future Enhancements

1. **Real-time Features**
   - WebSocket for live chat
   - Server-sent events for streaming responses

2. **Advanced Features**
   - File upload and analysis
   - Voice input/output
   - Multi-language support

3. **Performance**
   - Redis caching
   - CDN integration
   - Database replication

4. **Business Features**
   - Subscription tiers
   - Usage quotas
   - Multi-tenant support
   - Analytics dashboard
