# Setup and Deployment Guide

## Quick Start (Development)

### 1. Prerequisites Check

Ensure you have the following installed:
```bash
node --version  # Should be 18 or higher
npm --version
psql --version  # PostgreSQL
```

### 2. Initial Setup

```bash
# Clone and navigate to the project
cd customchat

# Create environment file
cp .env.example .env

# Edit .env with your settings
nano .env  # or use your preferred editor
```

### 3. Configure Environment Variables

**Required variables in `.env`:**

```env
# Database - Update with your PostgreSQL credentials
DATABASE_URL="postgresql://username:password@localhost:5432/customchat?schema=public"

# JWT Secrets - Generate strong random strings
JWT_SECRET="your-super-secret-key-min-32-chars"
JWT_REFRESH_SECRET="your-refresh-secret-key-min-32-chars"

# Azure OpenAI - Get from Azure Portal
AZURE_OPENAI_ENDPOINT="https://your-resource-name.openai.azure.com"
AZURE_OPENAI_API_KEY="your-azure-openai-api-key"
AZURE_OPENAI_DEPLOYMENT_NAME="gpt-4"
```

**To generate strong secrets:**
```bash
# Generate JWT secrets
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 4. Install Dependencies

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 5. Database Setup

```bash
cd backend

# Generate Prisma Client
npx prisma generate

# Create database and run migrations
npx prisma migrate dev --name init

# Verify schema
npx prisma studio  # Opens GUI at http://localhost:5555
```

### 6. Create Admin User

**Option A: Through the application**
1. Start the backend (next step)
2. Register a user through the frontend at http://localhost:3000/register
3. Update the user role in database:

```sql
-- Connect to your database
psql -U postgres -d customchat

-- Make user admin (replace with your email)
UPDATE users SET role = 'ADMIN' WHERE email = 'your-email@example.com';
```

**Option B: Direct SQL insert**
```sql
-- Generate password hash for "password123"
-- You'll need to generate this properly in Node.js
INSERT INTO users (id, email, password, name, role, is_active)
VALUES (
  gen_random_uuid(),
  'admin@example.com',
  '$2b$10$YourBcryptHashHere',  -- Replace with actual hash
  'Admin User',
  'ADMIN',
  true
);
```

To generate password hash:
```bash
node -e "const bcrypt = require('bcrypt'); bcrypt.hash('password123', 10).then(console.log);"
```

### 7. Add AI Model

**Option A: Through Admin Panel** (Recommended)
1. Login as admin at http://localhost:3000/admin
2. Navigate to AI Models
3. Click "Add Model" and fill in:
   - Name Display: GPT-4
   - Provider: AZURE_OPENAI
   - Endpoint URL: https://your-resource.openai.azure.com
   - Deployment Name: gpt-4
   - API Key Env Var: AZURE_OPENAI_API_KEY
   - Temperature: 0.7
   - Max Tokens: 2000
   - Is Active: true

**Option B: Direct SQL**
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

### 8. Start Development Servers

**Terminal 1 - Backend:**
```bash
cd backend
npm run start:dev

# Backend will start at http://localhost:3001
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev

# Frontend will start at http://localhost:3000
```

### 9. Access the Application

- **Homepage:** http://localhost:3000
- **User Chat:** http://localhost:3000/app
- **Admin Panel:** http://localhost:3000/admin
- **API:** http://localhost:3001

## Production Deployment

### Option 1: Docker Deployment

1. **Setup environment:**
```bash
# Copy and configure .env
cp .env.example .env
nano .env
```

2. **Build and run:**
```bash
# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

3. **Access:**
- Frontend: http://localhost:3000
- Backend: http://localhost:3001
- Database: localhost:5432

### Option 2: Manual Production Build

**Backend:**
```bash
cd backend

# Build
npm run build

# Run migrations
npx prisma migrate deploy

# Start production server
npm run start:prod
```

**Frontend:**
```bash
cd frontend

# Build
npm run build

# Start production server
npm start
```

### Option 3: Cloud Deployment (Azure)

**Azure Web Apps:**

1. Create Azure Web App for backend
2. Create Azure Web App for frontend
3. Create Azure Database for PostgreSQL
4. Set environment variables in Azure Portal
5. Deploy using GitHub Actions or Azure CLI

**Environment Variables in Azure:**
```bash
# Set in Azure Portal > Configuration > Application Settings
DATABASE_URL=postgresql://...
JWT_SECRET=...
AZURE_OPENAI_ENDPOINT=...
AZURE_OPENAI_API_KEY=...
```

## Troubleshooting

### Database Connection Issues

**Error: "Can't reach database server"**
```bash
# Check PostgreSQL is running
sudo systemctl status postgresql

# Start if not running
sudo systemctl start postgresql

# Test connection
psql -U postgres -d customchat
```

**Error: "Role does not exist"**
```bash
# Create PostgreSQL user
sudo -u postgres psql
CREATE USER youruser WITH PASSWORD 'yourpassword';
ALTER USER youruser CREATEDB;
```

### Prisma Migration Issues

**Error: "Migration failed"**
```bash
# Reset database (WARNING: Deletes all data)
npx prisma migrate reset

# Create new migration
npx prisma migrate dev --name init
```

**Error: "Prisma Client not generated"**
```bash
npx prisma generate
```

### Azure OpenAI Issues

**Error: "Invalid API key"**
- Verify API key in Azure Portal
- Check environment variable name matches
- Ensure no extra spaces in .env file

**Error: "Deployment not found"**
- Verify deployment name in Azure Portal
- Check model is deployed in your region
- Ensure endpoint URL is correct

**Error: "Rate limit exceeded"**
- Check your Azure OpenAI quota
- Implement rate limiting in backend
- Consider upgrading Azure plan

### Frontend Issues

**Error: "Module not found"**
```bash
cd frontend
rm -rf node_modules
rm package-lock.json
npm install
```

**Error: "Failed to connect to backend"**
- Verify backend is running
- Check NEXT_PUBLIC_API_URL in .env
- Check CORS settings in backend

### Authentication Issues

**Error: "Invalid token"**
- Check JWT_SECRET matches in backend
- Clear browser localStorage
- Re-login

## Testing

### Backend Tests
```bash
cd backend

# Unit tests
npm test

# E2E tests
npm run test:e2e

# Coverage
npm run test:cov
```

### Frontend Tests
```bash
cd frontend

# Run tests
npm test

# Run with coverage
npm run test:coverage
```

## Maintenance

### Database Backup
```bash
# Backup
pg_dump -U postgres customchat > backup.sql

# Restore
psql -U postgres customchat < backup.sql
```

### Update Dependencies
```bash
# Backend
cd backend
npm update
npm audit fix

# Frontend
cd frontend
npm update
npm audit fix
```

### Monitor Logs
```bash
# Backend logs
cd backend
npm run start:dev  # Watch mode shows logs

# Production logs
pm2 logs backend

# Docker logs
docker-compose logs -f backend
```

## Security Best Practices

1. **Never commit .env files**
2. **Use strong JWT secrets** (32+ characters)
3. **Enable HTTPS in production**
4. **Regularly update dependencies**
5. **Implement rate limiting**
6. **Monitor usage logs**
7. **Rotate API keys periodically**

## Performance Optimization

1. **Enable database indexes**
2. **Implement caching (Redis)**
3. **Use CDN for static assets**
4. **Enable compression**
5. **Optimize database queries**
6. **Implement pagination**

## Support

For additional help:
- Check GitHub Issues
- Review API documentation in README.md
- Contact support team
