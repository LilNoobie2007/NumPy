<div align="center">

# 🚀 NumPy: Personalized Health & Lifestyle Companion

![React](https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite_8-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)
![PWA](https://img.shields.io/badge/PWA_Ready-5A0FC8?style=for-the-badge&logo=pwa&logoColor=white)

*A Progressive Web App (PWA) designed to make daily health tracking seamless, shared, and motivating.*

---

</div>

## 📖 Project Title and Description

**NumPy** is a bespoke, mobile-first Progressive Web App (PWA) built to bridge the gap between personal habit tracking and partner accountability.

Most health apps isolate the user. NumPy solves this by providing a shared tracking ecosystem where users can monitor their daily water intake, step counts, meals, sleep, and mood, while allowing a connected partner to view their progress in real-time. It features automated, Zomato-style push notifications driven by Edge Functions, and dynamic personalized greetings to keep the user motivated.

### ✨ Key Features

* **Real-time Companion Sync:** Share a unique "Friend Code" to instantly link accounts and monitor each other's daily progress.
* **Automated Smart Reminders:** Supabase Edge Functions automatically check database logs and send customized web-push notifications if meals, water, or steps aren't logged by specific times.
* **Comprehensive Tracking:** Track Steps, Water, Meals, Weight, Sleep, Mood, and Menstrual Cycles in one clean, gamified dashboard.
* **PWA Installable:** Behaves like a native app on iOS and Android, complete with a custom Service Worker for offline capabilities and background sync.

---

## ⚙️ Installation and Requirements

To run NumPy locally, you need **Node.js 18+** and a **Supabase** account.

### 1. Clone the Repository

```bash
git clone https://github.com/LilNoobie2007/NumPy.git
cd NumPy
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Configuration

Create a `.env.local` file in the root directory and add your Supabase and VAPID keys:

```bash
VITE_SUPABASE_URL="https://your-project-id.supabase.co"
VITE_SUPABASE_ANON_KEY="your-anon-key"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"

VITE_VAPID_PUBLIC_KEY="your-vapid-public-key"
VAPID_PRIVATE_KEY="your-vapid-private-key"
```

---

## 💻 Usage Examples

### Running the Development Server

To start the Vite server with Hot Module Replacement (HMR):

```bash
npm run dev
```

Expected output: the terminal will display a local URL (usually `http://localhost:5173/`). Open this in your browser to view the app.

### Building for Production

To compile the React app and generate the PWA Service Worker assets:

```bash
npm run build
```

### Deploying Edge Functions

To update the automated push notification logic via Supabase CLI:

```bash
npx supabase functions deploy send-reminder --no-verify-jwt
```

---

## 🤝 Contributing Guidelines

This project was built as a personalized application, but community suggestions are welcome!

1. Fork the repository.
2. Create a new branch: `git checkout -b feature/your-feature-name`
3. Commit your changes: `git commit -m "feat: add some feature"`
4. Push to the branch: `git push origin feature/your-feature-name`
5. Open a Pull Request outlining your additions.

Please ensure all new components strictly use TypeScript and follow the existing Tailwind CSS styling conventions.

---

## 📜 License Information

This project is licensed under the MIT License.

You are free to use, modify, and distribute this software as long as the original copyright header is included. See the `LICENSE` file for the full text.

---

## 🙌 Acknowledgments and Credits

* Developed by Kevin (LilNoobie2007).
* Built using the ultra-fast Vite frontend tooling.
* Backend infrastructure, Authentication, and Edge Functions powered by Supabase.
* Push Notification architecture built on the Web Push API.
