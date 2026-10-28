# NOVA React Frontend — modular edition

React 19 + TypeScript + React Router + TanStack Query v5. Arabic RTL e-commerce UI connected to the unchanged NestJS backend. All original CSS/design is preserved.

**Full architecture, query cache rules, API coverage and separate-backend setup:** [README-AR.md](./README-AR.md).

```bash
npm install
npm run dev
npm run typecheck
npm run build
npm run test:architecture
```

Default: React runs at `http://localhost:5173` and proxies `/api` to NestJS at `http://localhost:3000`.
