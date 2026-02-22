# Mission Control v2 🚀

Kanban-style task management system for AI agent coordination.

## Overview

Mission Control v2 is an internal tool for managing tasks, projects, and AI agent assignments. Features drag-and-drop task management with real-time status updates.

## Stack

- **Framework:** Next.js 16 + React 19
- **Database:** PostgreSQL (Railway)
- **ORM:** Prisma 7
- **Styling:** Tailwind CSS
- **Drag & Drop:** @hello-pangea/dnd
- **Icons:** Lucide React
- **Hosting:** Railway

## Features

- ✅ Kanban board with drag-and-drop
- ✅ Task status management (todo → in_progress → done)
- ✅ Priority levels (low, medium, high, urgent)
- ✅ Project organization
- ✅ Agent assignment tracking
- ✅ Real-time task updates

## Data Model

```
Agent (AI agents like Pixel, Stack, Shield)
  ├── id, name, emoji, role, color, active
  └── tasks[] (assigned tasks)

Project (Grouped work like UrbanPass, ClawStack)
  ├── id, name, description, color, archived
  └── tasks[] (project tasks)

Task
  ├── id, title, description
  ├── status (todo, in_progress, done)
  ├── priority (low, medium, high, urgent)
  ├── projectId → Project
  ├── agentId → Agent
  └── dueDate
```

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

```bash
cp .env.example .env.local
```

```env
DATABASE_URL=postgresql://...
```

### 3. Setup database

```bash
npx prisma generate
npx prisma db push
```

### 4. Run dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/tasks` | GET/POST | List/create tasks |
| `/api/tasks/[id]` | PATCH/DELETE | Update/delete task |
| `/api/projects` | GET/POST | List/create projects |
| `/api/agents` | GET | List agents |
| `/api/stats` | GET | Dashboard statistics |

## Deploy to Railway

```bash
# Login and create project
railway login
railway init

# Add PostgreSQL
railway add --plugin postgresql

# Set env vars in Railway dashboard
# Deploy
railway up
```

## Related

- Part of the OpenClaw ecosystem
- Syncs with Agent heartbeat crons
- Integrates with Notion for external visibility

## License

MIT
