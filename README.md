# React + TypeScript + Vite

This template provides a minimal setup to get **React 19** working in **Vite** with **Hot Module Replacement (HMR)** and production-ready **ESLint** rules.

---

## 🚀 Core Plugins

The template supports two official plugins for fast compilation and bundling:

* **[@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react)** – Uses [Oxc](https://oxc.rs) for ultra-fast, Rust-powered processing.
* **[@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc)** – Uses [SWC](https://swc.rs/) as an alternative extensible Rust compiler.

---

## ⚡ React Compiler

The **React Compiler** is currently **disabled** by default in this template due to its impact on development and build performance. 

To opt-in and configure manual optimization tracking, follow the steps outlined in the [Official React Compiler Documentation](https://react.dev/learn/react-compiler/installation).

---

## 🏗️ Architecture & Languages

The project is structured around a **Service-Oriented Architecture (SOA)** to enforce loose coupling and maintain clear boundaries between system layers:

* **Backend / Core Services:** Fully bifurcated across modular micro-services built natively on **TypeScript**.
* **Frontend User Interface:** A decoupled client-side layout powered entirely by **React.js**.

---

## 🛠️ Advanced ESLint Configuration

For production-grade applications, we highly recommend upgrading your configuration to enforce **type-aware lint rules**. 

### 1. Enabling Type-Checked Rules
Update your configuration file as shown below to catch deep type errors:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // 1. Remove tseslint.configs.recommended and replace it with:
      tseslint.configs.recommendedTypeChecked,
      
      // 2. Alternatively, use this for stricter type enforcement:
      tseslint.configs.strictTypeChecked,
      
      // 3. Optionally, add this to maintain consistent code formatting styles:
      tseslint.configs.stylisticTypeChecked,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
])
```

### 2. React-Specific Rule Plugins
To improve code quality for component patterns and DOM manipulations, you can additionally install:
* **[eslint-plugin-react-x](https://npmx.dev/package/eslint-plugin-react-x)** – For core React structural rules.
* **[eslint-plugin-react-dom](https://npmx.dev/package/eslint-plugin-react-dom)** – For specific React DOM interaction boundaries.


