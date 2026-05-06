# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm dev        # Start development server at localhost:3000
pnpm build      # Production build
pnpm start      # Run production build
pnpm lint       # Run ESLint
```

There is no test runner configured yet.

## Architecture

This is a Next.js 16 app using the App Router, bootstrapped with `create-next-app`. It is in early/skeleton state — only the default landing page exists so far.

- **`src/app/`** — App Router root. `layout.tsx` defines the root HTML shell with Geist fonts and a flex-column body. `page.tsx` is the home route.
- **`@/*`** — Path alias resolving to `src/*` (configured in `tsconfig.json`).
- **Styling** — Tailwind CSS v4 via PostCSS. Dark mode is supported via the `dark:` variant using system preference.
- **Package manager** — pnpm (see `pnpm-workspace.yaml`). Use `pnpm` for all installs, not npm or yarn.
- **TypeScript** — strict mode enabled.
