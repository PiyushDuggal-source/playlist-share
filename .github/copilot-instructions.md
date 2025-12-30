<!-- Copilot Instructions for StudyStack repository -->

# Copilot / AI Agent Quick Guide

Purpose: help an AI coding agent be productive in this Next.js + Firebase repository.

- **Big picture**: This is a Next.js (app router, Next 16) TypeScript site called StudyStack that stores user profiles and "playlists" (course-like study stacks) in Firestore and uses Firebase Authentication (Google sign-in) for access control. UI is React + Tailwind + some client-only libs (markdown editor, dnd-kit).

- **Where to start**: Open `app/layout.tsx` to see global providers and `components/Providers.tsx` to see React Query setup. Authentication and Firestore helpers are in `lib/firebase/*`.

Key files (examples):

- `app/layout.tsx` — global metadata, `Providers`, `Navbar`, and `Analytics`.
- `components/Providers.tsx` — wraps app with `@tanstack/react-query`.
- `lib/firebase/config.ts` — Firebase init; relies on `NEXT_PUBLIC_FIREBASE_*` env vars.
- `lib/firebase/auth.ts` — Google sign-in flow and org restriction: only `@ds.study.iitm.ac.in` emails allowed.
- `lib/firebase/firestore.ts` — Firestore helpers and collection shapes (`playlists`, `users`).
- `app/actions.ts` — server action helpers (e.g. `revalidatePath`) used after writes to revalidate pages.

Architecture notes for code generation:

- App uses Next 16 app-directory. Components are server components by default; client components include `"use client"` at top. When modifying UI that interacts with browser APIs, ensure the file is a client component.
- Data flow: client UI calls Firestore helper functions (via client code that uses Firebase SDK); some writes trigger `revalidatePath` server actions to update server-rendered pages.
- React Query is used for client-side caching — use `useQuery` / `useMutation` patterns consistent with `components/Providers.tsx` defaults (staleTime ~1 minute).
- Drag-and-drop uses `@dnd-kit/*` for sortable playlists. Markdown editing uses `@uiw/react-md-editor`.

Env and runtime:

- Dev commands: `npm run dev` (Next dev), `npm run build`, `npm run start`.
- Required env vars (browser-exposed): `NEXT_PUBLIC_FIREBASE_API_KEY`, `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`, `NEXT_PUBLIC_FIREBASE_PROJECT_ID`, `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`, `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`, `NEXT_PUBLIC_FIREBASE_APP_ID`.
- Firebase is initialized with `getApps().length ? getApp() : initializeApp(...)` in `lib/firebase/config.ts`.

Project conventions and gotchas:

- Auth domain restriction: sign-in rejects non-`@ds.study.iitm.ac.in` emails (see `lib/firebase/auth.ts`). When testing locally, use an allowed email or adjust the validator intentionally.
- Client vs server boundary: prefer server components for static rendering; add `"use client"` and move browser-only logic (e.g., sign-in popup) into client components like `components/Navbar.tsx`.
- Revalidation: after creating/updating playlists the app uses `revalidatePath` from `app/actions.ts`. If you add new server-side data updates, ensure pages are revalidated similarly.
- Types: domain types live in `types/index.ts` (use those shapes when manipulating Firestore documents).

Integration points:

- Firebase (Auth + Firestore) — main backend. Helpers live under `lib/firebase` and should be the single source of truth for DB operations.
- Vercel Analytics is imported in `app/layout.tsx` but optional for local development.

Code examples (patterns to follow):

- Firestore read helper: `getPlaylist(id)` in `lib/firebase/firestore.ts` returns `Playlist | null`.
- Creating playlists uses `createPlaylist()` which sets `likes`, `createdAt`, `updatedAt` automatically.

When changing UI or data:

- Update the Firestore helper in `lib/firebase/firestore.ts` first if the change affects shape or persistence.
- For client UI, ensure React Query cache invalidation or use `revalidatePath` where appropriate. Prefer `useMutation` + `invalidateQueries` for client-only flows.

Testing and debugging tips:

- Run `npm run dev` and open `http://localhost:3000`.
- Check browser console for Firebase auth popup errors (client-only). For server/runtime errors, check terminal where `next dev` runs.

If you need to modify authentication behavior or allowed domains, edit `lib/firebase/auth.ts` and update the UI in `components/Navbar.tsx`.

If anything important is missing from this guide or you want different focus (tests, CI, PR checks), tell me which area to expand.
