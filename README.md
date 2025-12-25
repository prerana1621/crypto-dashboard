# 🚀 FinHub — Crypto, Stocks & Forex Dashboard

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16%20(App%20Router)-black?logo=next.js" />
  <img src="https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black" />
  <img src="https://img.shields.io/badge/Node.js-Serverless-339933?logo=node.js&logoColor=white" />
  <img src="https://img.shields.io/badge/TailwindCSS-v4-38B2AC?logo=tailwind-css&logoColor=white" />
  <img src="https://img.shields.io/badge/Recharts-Interactive%20Charts-8884d8" />
  <img src="https://img.shields.io/badge/Dark%20Mode-Supported-111827" />
  <img src="https://img.shields.io/badge/Responsive-Mobile%20Ready-success" />
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Firebase-Authentication-FFCA28?logo=firebase&logoColor=black" />
  <img src="https://img.shields.io/badge/Firestore-Database-orange" />
  <img src="https://img.shields.io/badge/Role--Based%20Access-Controlled-critical" />
  <img src="https://img.shields.io/badge/Protected%20Routes-Enabled-success" />
  <img src="https://img.shields.io/badge/App%20Router-Next.js%2016-black" />
</p>

<p align="center">
  <img src="https://img.shields.io/badge/API-CoinGecko-green" />
  <img src="https://img.shields.io/badge/API-Stooq-blue" />
  <img src="https://img.shields.io/badge/API-Frankfurter-orange" />
  <img src="https://img.shields.io/badge/Real--Time%20Market%20Data-Yes-success" />
  <img src="https://img.shields.io/badge/ESLint-Enabled-4B32C3?logo=eslint" />
  <img src="https://img.shields.io/badge/Deployed%20on-Vercel-black?logo=vercel" />
  <img src="https://img.shields.io/badge/Production--Ready-Yes-success" />
</p>

FinHub is a modern, full-stack financial dashboard built using **Next.js App Router**.  
It provides real-time insights into **cryptocurrency markets**, **stock prices**, and **forex exchange rates**, combined with secure authentication, role-based access, and interactive data visualizations.

🌐 **Live Demo:** https://crypto-dashboard-rho-seven.vercel.app/

---

## ✨ Features

### 🔐 Authentication & Authorization
- Firebase Authentication (Email & Password)
- Email verification & password reset
- Role-based access (`user` / `admin`)
- Protected routes with automatic redirects

### 📊 Market Dashboards

#### 🪙 Cryptocurrency Dashboard
- Live crypto prices using CoinGecko API
- 24-hour price change bar chart
- Favorite coins system (local storage)
- Detailed coin pages with 7-day price trend analysis

#### 📈 Stock Market Dashboard
- Live US stock prices via Stooq API
- Market insights: average price, top gainer & loser
- OHLC (candlestick-style) price visualization
- Individual stock detail pages with analytics

#### 💱 Forex Dashboard
- Real-time exchange rates using Frankfurter API
- Smart currency converter
- USD strength index visualization
- Clean, intuitive UI

### 🛠 Admin Panel
- Admin-only access
- View registered users from Firestore
- User role display
- System status indicators

### 🎨 UI & UX
- Fully responsive layout
- Dark / Light mode toggle (persistent)
- Smooth transitions and animations
- Interactive charts using Recharts
- Tailwind CSS v4 styling

---

## 🧱 Tech Stack

| Layer | Technology |
|------|-----------|
| Frontend | Next.js 16 (App Router), React 19 |
| Styling | Tailwind CSS v4 |
| Charts | Recharts |
| Authentication | Firebase Authentication |
| Database | Firebase Firestore |
| APIs | CoinGecko, Stooq, Frankfurter |
| Deployment | Vercel |

---

## 📁 Project Structure

```text
src/
├── app/
│   ├── api/
│   │   ├── crypto/
│   │   ├── stocks/
│   │   ├── forex/
│   │   └── ohlc/
│   ├── login/
│   ├── admin/
│   ├── coin/[id]/
│   ├── stocks/[id]/
│   ├── forex/
│   ├── layout.js
│   └── page.js
│
├── components/
│   └── ClientLayout.js
│
├── context/
│   └── AuthContext.js
│
├── lib/
│   ├── firebase.js
│   └── auth.js
│
└── globals.css
```
---
## ⚙️ Installation & Setup

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/prerana1621/crypto-dashboard.git
cd crypto-dashboard
```
### 2️⃣ Install Dependencies
```bash
npm install
```
### 3️⃣ Firebase Configuration
Update src/lib/firebase.js with your Firebase project credentials:
```js
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
};
```
**Enable the following in Firebase Console:**
- Email / Password Authentication
- Firestore Database
- Email Verification
### 4️⃣ Run the Development Server
```bash
npm run dev
```
Open http://localhost:3000 in your browser.

---
## 🔒 Role-Based Access Control

The application implements a secure RBAC system using **Firebase Firestore**.

| Role | Permissions |
| :--- | :--- |
| **User** | Access Crypto, Stocks & Forex dashboards |
| **Admin** | All user features + **Admin Panel** (User management, System status) |

**Note:** Admin roles are stored in the Firestore `users` collection:

```json
{
  "role": "admin"
}
```

---
## 📦 API Endpoints

| Endpoint | Description |
| :--- | :--- |
| `/api/crypto` | Fetch top cryptocurrencies |
| `/api/stocks` | Fetch live stock prices |
| `/api/ohlc?id=AAPL` | Fetch OHLC stock data |
| `/api/forex` | Fetch forex exchange rates |

---
## 🚀 Deployment
This project is optimized for **Vercel** deployment.
```bash
npm run build
npm run start
```
Push the repository to GitHub and deploy directly from the **Vercel Dashboard**.

---
## 🧠 Future Enhancements
- Real-time WebSocket updates
- Firestore-based watchlists
- Technical indicators (RSI, MACD)
- Market news integration
- Portfolio simulation
- Progressive Web App (PWA) support

---
## 👩‍💻 Author
Prerana Acharyya

Full-Stack Developer

GitHub: https://github.com/prerana1621

---
## ⭐ Support
If you find this project helpful:
- ⭐ Star the repository
- 🍴 Fork and improve it
- 💬 Share feedback
