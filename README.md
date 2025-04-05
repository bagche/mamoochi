# Mamochi - Headless, Git-Native, Serverless CMS & Web Platform Framework

Mamochi is a modern, headless content management and web platform framework built for developers who need a scalable, modular, and developer-friendly environment. It combines a Git-based workflow with real-time, decentralized features to deliver a robust system for building content-rich websites and applications.

---

## Overview

Mamochi leverages cutting-edge technologies and serverless infrastructure to deliver a headless-first experience. Key aspects include:

- **Headless-First Architecture:** Decoupled backend content management and frontend rendering, allowing you to use any modern frontend framework (e.g., Nuxt, Vue, React).

- **Git-Native Versioning:** Every content edit is stored as a commit, grouped into builds, and pushed to GitHub—ensuring full version control and auditability.

- **Serverless & Scalable:** Powered by Cloudflare Workers, Durable Objects, D1, and KV storage, Mamochi offers global low-latency performance.

- **Real-Time Collaboration & Decentralization:** Integrates with Cloudflare’s real-time technologies and the Nostr protocol for decentralized messaging and identity.

- **Modular & Extensible:** A plugin-based system allows easy extension of core features—custom routes, middleware, dashboards, and more.

---

## Architecture

### Frontend & User Interface

- **Nuxt & Vue:**

Mamochi uses Nuxt (v3/4) and Vue 3 for both SSR and SSG, providing fast, SEO-friendly rendering and reactive UI components.

- **Tiptap Editor:**

A rich, visual Markdown editor that allows content creators to work with Markdown (with front matter) seamlessly.

- **TailwindCSS & Nuxt UI:**

Rapid styling with TailwindCSS and pre-built UI components accelerate frontend development.

### Backend & API

- **Cloudflare Workers:**

The serverless backend runs on Cloudflare Workers, providing global distribution and auto-scaling.

- **Cloudflare D1 & KV Storage:**

Use Cloudflare’s serverless SQL (D1) and KV storage for efficient data management and caching.

- **Durable Objects:**

Manage real-time state (such as collaborative editing and live dashboards) with Cloudflare Durable Objects.

- **Drizzle ORM:**

A type-safe SQL query builder simplifies interactions with your Cloudflare D1 database.

### Commit/Build System & GitHub Integration

- **Commit System:**

Each edit to a Markdown page is saved as a commit that includes file path, content, and a commit message.

- **Build Aggregation:**

Commits are grouped into builds. An admin can review a build and trigger the push process, which:

- Creates a new Git tree (updating modified files).

- Creates a new commit on a target branch (e.g., `develop`).

- Updates the branch reference via the GitHub API.

- **CI/CD Integration:**

Once a build is pushed, GitHub triggers Cloudflare Pages CI/CD to deploy the updated content.

### Real-Time & Decentralized Communication

- **Nostr Protocol Integration:**

Mamochi supports decentralized identity and messaging with Nostr—enabling real-time notifications, chat, and collaborative features without relying on centralized servers.

### Plugin & Extensibility System

- **Modular Plugin Architecture:**

Developers can extend or override core functionalities through plugins. Custom routes, middleware, dashboards, and integrations (e.g., custom auth or monetization strategies) can be added without modifying the core codebase.

---

## Key Features

- **Headless CMS:**

Manage Markdown-based content (with YAML front matter) in a Git-based workflow.

- **Git-Native Versioning:**

Every edit is versioned as a commit. Builds aggregate commits, enabling controlled pushes and CI/CD triggers.

- **Serverless Infrastructure:**

Powered by Cloudflare Workers, D1, KV, and Durable Objects for low-latency, scalable backend operations.

- **Real-Time Collaboration:**

Built-in real-time state management and decentralized messaging via the Nostr protocol.

- **Extensible & Modular:**

Easily extend functionalities using a robust plugin system.

- **Developer-Friendly:**

Modern tools like Nuxt, Vue, TailwindCSS, Drizzle ORM, ESLint, Prettier, and Vitest provide an optimized development experience.

---

## Getting Started

### Prerequisites

- **Node.js (v18+)**

- **pnpm (or npm/yarn)**

- **Cloudflare CLI (Wrangler)** for deployment

- **GitHub Account** with repository access for Git-based content management

### Installation

1. **Clone the Repository:**

```sh

git clone git@github.com:bagche/mamoochi.git

cd mamoochi

pnpm install

```

2. **Start the Development Server:**

```sh

pnpm dev

```

Visit `http://localhost:3000` to see the application in action.

3. **Build for Production:**

```sh

NITRO_PRESET=cloudflare-pages pnpm build

```

4. **Deploy to Cloudflare Workers:**

```sh

npx wrangler pages deploy

```

---

## License

Mamochi is released under the **MIT License**. See the [LICENSE](LICENSE) file for details.

---

Mamochi is an evolving project that embraces open-source principles, community collaboration, and cutting-edge web technologies to empower developers in building scalable, modular, and high-performance web applications.
