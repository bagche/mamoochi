# Mamoochi - Modular, Serverless-First Web Platform Framework

**Mamoochi** is a highly modular and extensible web platform framework built on modern web technologies. Designed to support hybrid Server-Side Rendering (SSR) and Static Site Generation (SSG), Mamoochi is optimized for performance and scalability while providing a flexible foundation for rapid development and customization.

This framework leverages a combination of a Nuxt 4 frontend with a serverless backend powered by Cloudflare Workers. It’s built for developers who need fine-grained control over both the frontend and backend, with clear separation of concerns and an extensible plugin system that simplifies feature integration and maintenance.

---

## 🚀 Architecture Overview

Mamoochi is built on a decoupled, modular architecture that separates concerns and optimizes for performance, scalability, and developer productivity. Each layer of the platform is designed to function independently while integrating seamlessly for a unified development experience.

### **Frontend & UI:**

- **Nuxt 4 & Vue 3:**  
  The frontend is powered by Nuxt 4 and Vue 3, supporting both SSR and SSG for fast, SEO-friendly page rendering. This setup enables reactive UI components and an efficient development workflow.
- **TailwindCSS & Nuxt UI 3:**  
  We utilize TailwindCSS for rapid, utility-first styling, complemented by Nuxt UI 3’s collection of pre-built components to speed up UI development and maintain consistency.

### **Backend & API:**

- **Cloudflare Workers & Serverless Infrastructure:**  
  Our backend is deployed on Cloudflare Workers, offering global distribution with low latency and auto-scaling capabilities. The integration with Cloudflare D1, KV storage, and Durable Objects provides robust and efficient data management.
- **Plugin Architecture:**  
  Mamoochi’s flexible plugin system lets developers extend core functionalities—whether adding new API endpoints or overriding default UI components—without altering the core codebase.

### **Hybrid CMS Model:**

- **Tiptap + GitHub-based Headless Panel:**  
  The Hybrid CMS Model is designed for a seamless, headless content management experience. It leverages the powerful Tiptap rich text editor to provide a flexible and intuitive editing interface. This is coupled with a GitHub-based version control system, enabling content creators to manage, collaborate, and version their site content with confidence. Content is then delivered via static generation or rendered on-demand, ensuring rapid performance without sacrificing dynamic updates.

### **Real-Time Communication & State Management:**

- **Decentralized Messaging (Nostr):**  
  Utilizing the Nostr protocol, Mamoochi supports real-time, decentralized communication for chat, notifications, and comment systems, ensuring resilience and reducing reliance on centralized servers.

---

## This detailed view of Mamoochi’s architecture highlights the key components and technical choices that empower developers to build, customize, and scale high-performance web applications efficiently.

## 🛠️ Frameworks & Libraries Used

Mamoochi is built on a modern technology stack, carefully selected to enhance developer productivity and application performance:

### **Frontend**

- **Nuxt 4:**  
  A robust framework for Vue.js that supports both SSR and SSG, enabling dynamic and statically generated content.
- **Vue 3:**  
  Provides a reactive component model for building scalable and maintainable UIs.
- **TailwindCSS:**  
  A utility-first CSS framework that accelerates styling and ensures consistency across components.
- **Nuxt UI 3:**  
  A collection of pre-built UI components optimized for Nuxt, reducing the need for boilerplate code.

### **Backend & API**

- **Cloudflare Workers:**  
  Serverless compute that scales globally with low latency, ideal for API endpoints and backend logic.
- **Cloudflare D1:**  
  A lightweight, serverless SQL database compatible with SQLite, designed for rapid development and scale.
- **Cloudflare KV:**  
  A fast, globally distributed key-value storage system for caching and session management.
- **Durable Objects:**  
  Provides stateful coordination and data storage to manage real-time interactions efficiently.

### **Messaging & Local Storage**

- **Nostr Protocol:**  
  A decentralized messaging protocol for real-time notifications, chat, and comment systems.
- **Dexie.js:**  
  An IndexedDB wrapper that simplifies local storage operations in the browser.

### **Developer Experience**

- **Drizzle ORM:**  
  A type-safe SQL query builder that enhances database interactions while minimizing runtime errors.
- **ESLint & Prettier:**  
  Integrated tooling for code formatting and linting to maintain a clean, consistent codebase.
- **Vitest:**  
  A fast and modern unit testing framework that integrates seamlessly with Vue and JavaScript projects.

---

## 🌍 Open-Source Philosophy

At its core, Mamoochi embraces an open-source philosophy. We believe that software should be transparent, community-driven, and free from vendor lock-in. Our guiding principles include:

- **Transparency & Freedom:**  
  Every component of Mamoochi is open for review and modification, allowing developers to tailor the framework to their needs.

- **Community-Driven Development:**  
  Contributions from developers around the globe are not only welcomed but essential to the continuous improvement and evolution of the platform.

- **Performance & Simplicity:**  
  The architecture is designed to remain lightweight and efficient, ensuring fast performance even at scale while keeping the codebase accessible for new contributors.

- **Flexible Monetization:**  
  While Mamoochi provides a robust core framework for free, it allows for easy integration of custom monetization strategies without compromising the open-source model.

---

## 📥 Installation & Getting Started

To start using Mamoochi, follow these steps:

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
