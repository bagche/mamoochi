# Mamoochi - Modular Web Platform Framework

**Mamoochi** is a **modular, extensible, and serverless-first** web platform framework built with **Nuxt 4** and **Cloudflare Workers**. It provides a **hybrid SSR (Server-Side Rendering) + SSG (Static Site Generation)** architecture, designed for **performance, flexibility, and scalability**.

This framework enables developers to **build dynamic, real-time applications** while leveraging **static content delivery** for speed and cost efficiency. It comes with a **powerful plugin system**, **decentralized messaging via Nostr**, and **a headless CMS approach** to managing content.

---

## 🚀 Architecture Overview

Mamoochi follows a **headless-first, modular architecture**, ensuring efficient content management and **seamless extensibility**.

### 🔹 Core Components:

- **Nuxt 4-based Frontend** → Vue 3, TailwindCSS, Nuxt UI for fast and modern UI development.
- **Serverless Backend** → Cloudflare Workers, D1 (SQLite-compatible), KV storage, and Durable Objects for scalable backend solutions.
- **Hybrid CMS Model** → Combines SSG for fast static pages and SSR for dynamic updates, ensuring both speed and flexibility.
- **Decentralized Messaging (Nostr)** → Supports chat, comments, and real-time notifications without reliance on centralized servers.
- **Plugin System** → Developers can extend both backend and frontend with plugins that modify UI components, admin tools, and API routes.
- **User & Role Management** → A built-in system for managing users, roles, and permissions, similar to WordPress but fully serverless.
- **Web3 & Traditional Payments** → Supports cryptocurrency payments alongside standard payment gateways.

---

## 🛠️ Frameworks & Libraries Used

Mamoochi is built on a **modern technology stack** with a focus on performance, scalability, and developer experience:

### **Frontend**

- **Nuxt 4** → Hybrid SSR/SSG framework for Vue.js.
- **Vue 3** → Reactive UI framework.
- **TailwindCSS** → Utility-first CSS for rapid styling.
- **Nuxt UI 3** → Pre-built UI components optimized for Nuxt.

### **Backend & API**

- **Cloudflare Workers** → Serverless compute environment.
- **D1 (Cloudflare Database)** → Serverless SQL database based on SQLite.
- **Cloudflare KV** → Key-value store for fast access to cached data.
- **Durable Objects** → Real-time data storage and coordination.

### **Messaging & Web3**

- **Nostr Protocol** → Decentralized messaging and comment system.
- **Dexie.js** → IndexedDB wrapper for local storage in the browser.
- **Ethers.js** → Web3 library for Ethereum and blockchain integrations.

### **Developer Experience**

- **Drizzle ORM** → Type-safe SQL query builder for database interactions.
- **ESLint & Prettier** → Code formatting and linting for clean, maintainable code.
- **Vitest** → Unit testing framework for Vue and JavaScript.

---

## 🌍 Open-Source Philosophy

Mamoochi is **100% open-source**, driven by the belief that **software should be accessible, customizable, and free from vendor lock-in**.

We follow these core principles:

1. **Freedom & Transparency** → All code is open for review, modification, and contribution.
2. **Decentralization** → By leveraging Nostr, we enable free, censorship-resistant communication.
3. **Community-Driven Development** → Contributions from developers worldwide help shape the future of Mamoochi.
4. **Simplicity & Performance** → Keeping the architecture lightweight, efficient, and easy to scale.
5. **Monetization without Lock-in** → While businesses can monetize their implementations, the core framework remains free and open.

### 🤝 Contributing

We welcome all contributions! Whether you want to **fix a bug, suggest a feature, or improve documentation**, we encourage you to participate.

- **Fork the repo**
- **Submit pull requests**
- **Discuss features in GitHub Issues**

> "Open-source is not just about sharing code. It’s about **building a community** where innovation is limitless."

---

## 📥 Installation & Getting Started

To start using **Mamoochi**, follow these steps:

### **1️⃣ Prerequisites**

Ensure you have the following installed:

- **Node.js (v18+)**
- **pnpm (preferred) or npm/yarn**
- **Cloudflare CLI** (for deployment)

### **2️⃣ Clone the Repository**

```sh
git clone git@github.com:Bagche/Mamoochi.git
cd Mamoochi
pnpm install
```

### **3️⃣ Start the Development Server**

```sh
pnpm dev
```

The project will be available at `http://localhost:3000`.

### **4️⃣ Build for Production**

```sh
NITRO_PRESET=cloudflare-pages pnpm build
```

### **5️⃣ Deploy to Cloudflare Workers**

```sh
npx wrangler pages deploy
```

---

## 📜 License

Mamoochi is released under the **MIT License**, meaning you are free to use, modify, and distribute it **with proper attribution**.

---
