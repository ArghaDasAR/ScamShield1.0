# 🛡️ ScamShield

**Think Before You Click.**

An AI-powered behavioral firewall that detects social engineering before users make dangerous digital decisions.

---

## 🚀 Quick Start

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

---

## 🔑 Cloudinary Setup (Optional)

For screenshot upload, create a free [Cloudinary](https://cloudinary.com) account and add to `.env`:

```env
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
VITE_CLOUDINARY_UPLOAD_PRESET=your_upload_preset
```

> **Note:** The app works fully without Cloudinary — screenshots are previewed locally in demo mode.

---

## 🎯 Demo Flow (for Hackathon Judges)

1. **Home** → Click **"Upload Message"**
2. **Analyze** → Click **"Electricity Scam"** in the sidebar
3. **Message auto-populates** → Click **"Analyze"**
4. **Scan** → Watch animated AI analysis steps
5. **Result** → See **93% HIGH RISK — SCAM LIKELY**
6. **History** → View all past analyses

---

## 📋 Features

- **Multi-format analysis**: Screenshots, SMS/WhatsApp, Email, URLs
- **Social engineering detection**: Authority Impersonation, Urgency, Threat, Financial Coercion
- **Animated risk score** with circular progress ring
- **Demo examples** — one-click populate for judges
- **Analysis history** persisted in localStorage
- **Cloudinary integration** with graceful demo-mode fallback
- **Fully responsive** — works on mobile & desktop

---

## 🏗️ Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| React | 18 | UI framework |
| Vite | 8 | Build tool |
| Tailwind CSS | 3 | Styling |
| React Router | 6 | Routing |
| Framer Motion | 12 | Animations |
| Lucide React | latest | Icons |
| Cloudinary | API | Image upload |

---

## 📁 Project Structure

```
src/
├── components/       # Reusable UI components
│   ├── Navbar.jsx
│   ├── HeroShield.jsx
│   ├── GlassCard.jsx
│   ├── UploadBox.jsx
│   ├── ExampleInputs.jsx
│   ├── RiskScore.jsx
│   ├── TacticList.jsx
│   ├── RecommendationCard.jsx
│   ├── HistoryList.jsx
│   └── RiskBadge.jsx
├── pages/
│   ├── Home.jsx
│   ├── Analyze.jsx
│   ├── Scan.jsx
│   ├── Result.jsx
│   ├── History.jsx
│   └── HowItWorks.jsx
├── services/
│   ├── cloudinary.js    # Image upload (swap for real API)
│   └── scamAnalyzer.js  # AI analysis (swap for real API)
├── context/
│   └── AppContext.jsx   # Global state + localStorage
└── data/
    └── demoScams.js     # Demo content for presentation
```

---

## 🔌 Backend Integration

The service layer is designed for easy API replacement:

```js
// src/services/scamAnalyzer.js
export const analyzeContent = async (input) => {
  // Replace this with: return fetch('/api/analyze', { ... })
  return mockAnalysis(input);
};
```

---

## Warning

ScamShield is a hackathon prototype for demonstration purposes. It does not provide guaranteed cybersecurity protection. Always verify suspicious content through official channels.

---

Built for hackathon by **Argha Das** | Powered by React + Vite + Tailwind CSS
