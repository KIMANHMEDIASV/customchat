# Custom Chat - AI Chat Application with Azure OpenAI

A full-stack AI chat application powered by Azure OpenAI and Azure Foundry, featuring a modern chat interface and comprehensive admin panel.

## 🌟 Features

### User Features
- 🔐 User authentication (register, login, JWT-based)
- 💬 Chat with AI models (ChatGPT-like interface)
- 🤖 Select from multiple AI models (GPT-4, o3-mini, Phi-4, etc.)
- 📚 Conversation history management
- 🔄 Real-time message streaming
- 📊 Personal usage statistics

### Admin Features
- 👥 User management (CRUD operations)
- 🤖 AI Model configuration
  - Configure endpoint URLs
  - Set API keys via environment variables
  - Adjust temperature and max tokens
  - Enable/disable models
- 📈 Usage logs and analytics
- 📊 Dashboard with statistics

## 🏗️ Architecture

### Tech Stack

**Frontend:**
- Next.js 14 (App Router)
- TypeScript
- TailwindCSS
- Zustand (state management)
- React Markdown

**Backend:**
- NestJS
- TypeScript
- Prisma ORM
- PostgreSQL
- JWT Authentication
- Axios (Azure API integration)

**Database:**
- PostgreSQL with Prisma

## 📁 Project Structure

```
customchat/
├── backend/                 # NestJS backend
│   ├── src/
│   │   ├── auth/           # Authentication module
│   │   ├── users/          # User management
│   │   ├── ai-models/      # AI model configuration
│   │   ├── conversations/  # Conversation management
│   │   ├── chat/           # Chat API with Azure integration
│   │   ├── admin/          # Admin panel API
│   │   ├── usage-logs/     # Usage tracking
│   │   ├── prisma/         # Database service
│   │   └── common/         # Guards, decorators, utilities
│   └── package.json
├── frontend/               # Next.js frontend
│   ├── src/
│   │   ├── app/           # Next.js 14 app router
│   │   │   ├── login/     # Login page
│   │   │   ├── register/  # Register page
│   │   │   ├── app/       # User chat interface
│   │   │   └── admin/     # Admin panel
│   │   ├── components/    # React components
│   │   ├── hooks/         # Custom React hooks
│   │   ├── lib/           # API client & state management
│   │   └── types/         # TypeScript types
│   └── package.json
├── prisma/                # Database schema
│   └── schema.prisma
├── .env.example           # Environment variables template
└── package.json           # Root package.json

```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL database
- Azure OpenAI or Azure Foundry account with API keys

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/KIMANHMEDIASV/customchat.git
cd customchat
```

2. **Setup environment variables**
```bash
cp .env.example .env
```

Edit `.env` and configure:
```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/customchat?schema=public"

# JWT Secrets
JWT_SECRET="your-secret-key-change-this"
JWT_REFRESH_SECRET="your-refresh-secret-key-change-this"

# Backend
BACKEND_PORT=3001

# Frontend
NEXT_PUBLIC_API_URL="http://localhost:3001"

# Azure OpenAI
AZURE_OPENAI_ENDPOINT="https://your-resource.openai.azure.com"
AZURE_OPENAI_API_KEY="your-api-key"
AZURE_OPENAI_DEPLOYMENT_NAME="gpt-4"
```

3. **Install dependencies**
```bash
# Install all dependencies
npm run install:all

# Or install separately
cd backend && npm install
cd ../frontend && npm install
```

4. **Setup database**
```bash
cd backend

# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev --name init

# (Optional) Open Prisma Studio to view data
npx prisma studio
```

5. **Seed initial AI model (optional)**

You can manually add an AI model through the admin panel, or insert directly into the database:

```sql
INSERT INTO ai_models (
  id, 
  name_display, 
  provider, 
  endpoint_url, 
  deployment_or_model_name, 
  api_key_env_var, 
  temperature, 
  max_tokens, 
  is_active
) VALUES (
  gen_random_uuid(),
  'GPT-4',
  'AZURE_OPENAI',
  'https://your-resource.openai.azure.com',
  'gpt-4',
  'AZURE_OPENAI_API_KEY',
  0.7,
  2000,
  true
);
```

6. **Create an admin user**

First, register a user through the UI, then update their role in the database:

```sql
UPDATE users SET role = 'ADMIN' WHERE email = 'your-email@example.com';
```

### Running the Application

**Development mode:**

```bash
# Terminal 1 - Backend
cd backend
npm run start:dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

**Production mode:**

```bash
# Build backend
cd backend
npm run build
npm run start:prod

# Build frontend
cd frontend
npm run build
npm start
```

Access the application:
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001
- User Chat: http://localhost:3000/app
- Admin Panel: http://localhost:3000/admin

## 📖 API Documentation

### Authentication Endpoints

- `POST /auth/register` - Register new user
- `POST /auth/login` - Login user

### User Endpoints (Protected)

- `GET /users/profile` - Get current user profile
- `PATCH /users/profile` - Update profile

### AI Models Endpoints (Protected)

- `GET /ai-models` - Get all models
- `GET /ai-models/active` - Get active models only
- `GET /ai-models/:id` - Get specific model

### Conversations Endpoints (Protected)

- `POST /conversations` - Create new conversation
- `GET /conversations` - Get user's conversations
- `GET /conversations/:id` - Get conversation with messages
- `PATCH /conversations/:id` - Update conversation
- `DELETE /conversations/:id` - Delete conversation

### Chat Endpoints (Protected)

- `POST /chat/send` - Send message and get AI response

### Admin Endpoints (Admin Only)

**Users:**
- `GET /admin/users` - Get all users
- `POST /admin/users` - Create user
- `PUT /admin/users/:id` - Update user
- `DELETE /admin/users/:id` - Delete user

**Models:**
- `GET /admin/models` - Get all models
- `POST /admin/models` - Create model
- `PUT /admin/models/:id` - Update model
- `DELETE /admin/models/:id` - Delete model

**Logs:**
- `GET /admin/usage-logs` - Get usage logs
- `GET /admin/stats` - Get dashboard statistics

## 🔧 Configuration

### Adding New AI Models

1. **Via Admin Panel:**
   - Login as admin
   - Navigate to `/admin/models`
   - Add model configuration

2. **Via Database:**
```sql
INSERT INTO ai_models (
  name_display,
  provider,
  endpoint_url,
  deployment_or_model_name,
  api_key_env_var,
  temperature,
  max_tokens,
  is_active
) VALUES (
  'o3-mini',
  'AZURE_OPENAI',
  'https://your-resource.openai.azure.com',
  'o3-mini',
  'AZURE_OPENAI_API_KEY',
  0.5,
  4000,
  true
);
```

### Environment Variables for Multiple Models

You can use different API keys for different models:

```env
AZURE_OPENAI_API_KEY="key-for-gpt-4"
AZURE_FOUNDRY_API_KEY="key-for-foundry-models"
O3_MINI_API_KEY="key-for-o3-mini"
```

Then set `api_key_env_var` field to the corresponding variable name.

## 🎨 UI Components

### Chat Interface
- Sidebar with conversation list
- ChatGPT-like message display
- Model selector dropdown
- Message input with send button
- Markdown rendering for AI responses

### Admin Panel
- Dashboard with statistics
- User management table
- AI model configuration
- Usage logs with pagination

## 🔐 Security Features

- JWT-based authentication with refresh tokens
- Password hashing with bcrypt
- Role-based access control (USER/ADMIN)
- Protected API routes
- Input validation with class-validator
- CORS configuration

## 📈 Usage Tracking

The application automatically logs:
- Tokens used per message (prompt + completion)
- User and model information
- Timestamp of each interaction

Access logs through:
- Admin panel: `/admin/logs`
- API: `GET /admin/usage-logs`

## 🚧 Future Enhancements

1. **Subscription System**
   - Add subscription tiers
   - Token quota management
   - Payment integration

2. **Multi-tenant Support**
   - Organization management
   - Team workspaces
   - Shared conversations

3. **Advanced Features**
   - File upload support
   - Image generation
   - Voice input/output
   - Conversation export
   - Advanced search

4. **Performance**
   - Redis caching
   - Message streaming
   - Rate limiting
   - CDN integration

5. **Analytics**
   - Advanced usage analytics
   - Cost tracking
   - User behavior insights

## 🛠️ Troubleshooting

### Database Connection Issues
```bash
# Check PostgreSQL is running
psql -U postgres

# Test connection
npx prisma db pull
```

### Azure OpenAI API Errors
- Verify endpoint URL format
- Check API key is correct
- Ensure deployment name matches Azure
- Verify API version is supported

### Build Errors
```bash
# Clear caches
rm -rf node_modules
rm -rf .next
rm -rf dist

# Reinstall
npm install
```

## 📝 License

MIT License - feel free to use this project for learning or commercial purposes.

## 👥 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Support

For issues and questions, please open an issue on GitHub.
