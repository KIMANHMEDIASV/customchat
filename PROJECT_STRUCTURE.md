# Tổng quan cấu trúc thư mục dự án

```
customchat/
├─ frontend/                 # Next.js 14 + TypeScript + TailwindCSS
│  ├─ src/
│  │  ├─ app/               # App Router
│  │  ├─ components/        # UI components
│  │  ├─ hooks/             # React hooks gọi API
│  │  ├─ lib/               # helper, api client
│  │  └─ styles/            # global styles (nếu cần)
│  ├─ public/
│  └─ tailwind.config.ts
├─ backend/                  # NestJS/Express + TypeScript
│  ├─ src/
│  │  ├─ modules/
│  │  │  ├─ auth/
│  │  │  ├─ user/
│  │  │  ├─ model/
│  │  │  ├─ chat/
│  │  │  ├─ conversation/
│  │  │  └─ message/
│  │  ├─ common/             # middleware, guards, interceptors
│  │  └─ main.ts
│  └─ test/
├─ database/                 # Prisma schema + migrations
│  ├─ prisma/
│  │  └─ schema.prisma
│  └─ migrations/
├─ scripts/                  # tiện ích CLI (seed, maintenance)
└─ docs/                     # tài liệu thiết kế, API
```
