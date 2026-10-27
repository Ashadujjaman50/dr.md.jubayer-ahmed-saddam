# Dr. Md. Jubayer Ahmed Saddam — Surgical Specialist Portfolio

A modern, high-performance, responsive React.js frontend portfolio website for **Dr. Md. Jubayer Ahmed Saddam** (MBBS, BCS Health, FCPS Surgery), Assistant Professor of Surgery at Ad-din Medical College & Hospital, Dhaka, and Visiting Specialist Surgeon at New Green Life Hospital, Ashuganj, Brahmanbaria.

---

## 🩺 Overview & Clinical Focus

- **Specialist Surgeon:** Dr. Md. Jubayer Ahmed Saddam (ডাঃ মোঃ জুবায়ের আহমেদ সাদ্দাম)
- **Academic Designation:** Assistant Professor (Surgery), Ad-din Medical College & Hospital, Dhaka
- **Specializations:** General Surgery, Laparoscopic (Keyhole) Surgery, Colorectal & Piles Surgery, Liver & Gallbladder Surgery
- **Ashuganj Visiting Chamber:** New Green Life Hospital, Station Road, Ashuganj, Brahmanbaria
- **Visiting Schedule:** Every Thursday, 2:00 PM – 8:00 PM
- **Serial & Emergency Helpline:** `01771-358595` (+8801771-358595)
- **Hospital Location Coordinates:** `24.0424943, 91.0089444`

---

## 🚀 Architecture: Frontend-Only (React + Vite)

This project is built as a pure **client-side React application** powered by **Vite**.

- **No backend/Node.js/Express application server is required** to run or build the website.
- **Fast Build & Hot Module Replacement (HMR)** via Vite.
- **Modular Services Layer** (`src/services/`): Handles appointment request preparation and contact form submissions in client-side state without claiming false bookings or unverified email dispatches.
- **Email Integration Roadmap:** Direct email submission will be connected later via a secure provider-supported serverless function or client-safe email gateway (e.g., EmailJS with public tokens). Private credentials and SMTP keys are intentionally kept outside frontend code.

---

## 🛠️ Technologies Used

- **Framework:** React 19 (Hooks, Functional Components)
- **Build Tool:** Vite 6
- **Styling:** Vanilla CSS3 with responsive design tokens, medical glassmorphism, and fluid layout grids
- **Icons:** Lucide React (`lucide-react`)
- **Typography:** Google Fonts (`Inter` & `Noto Sans Bengali`)

---

## 📂 Project Structure

```
project/
├── public/
│   └── assets/
│       ├── cv.pdf                   # Downloadable Curriculum Vitae
│       ├── doctor-transparent.png   # Transparent cutout portrait
│       └── doctor.jpg               # Standard portrait image
├── src/
│   ├── components/
│   │   ├── Header.jsx & Header.css
│   │   ├── Hero.jsx & Hero.css
│   │   ├── Affiliations.jsx & Affiliations.css
│   │   ├── Services.jsx & Services.css
│   │   ├── About.jsx & About.css
│   │   ├── Reviews.jsx & Reviews.css
│   │   ├── LocationHours.jsx & LocationHours.css
│   │   ├── Footer.jsx & Footer.css
│   │   ├── AppointmentModal.jsx
│   │   ├── ContactModal.jsx
│   │   ├── ServiceDetailModal.jsx
│   │   ├── LegalModal.jsx
│   │   └── Modal.css
│   ├── data/
│   │   └── doctorConfig.js          # Centralized clinical profile & config
│   ├── services/
│   │   ├── appointmentService.js    # Modular appointment request handler
│   │   └── contactService.js        # Modular contact message handler
│   ├── App.jsx & App.css
│   ├── index.css                    # Design system tokens & utility styles
│   └── main.jsx                     # React DOM entry point
├── .env.example                     # Environment template (no secrets)
├── .gitignore                       # Git exclusions
├── index.html                       # HTML5 entry with metadata & Google Fonts
├── package.json                     # Scripts & frontend dependencies
├── package-lock.json
├── README.md
└── vite.config.js                   # Vite configuration
```

---

## 💻 Prerequisites

Ensure you have Node.js and npm installed:

- **Node.js:** v18.0.0 or later (v20+ recommended)
- **npm:** v9.0.0 or later

---

## ⚡ Getting Started (Local Development)

Execute the following commands in PowerShell or Command Prompt:

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Local Development Server
```bash
npm run dev
```
The application will launch at: `http://localhost:5173/`

### 3. Production Build
```bash
npm run build
```
Creates an optimized production bundle in the `dist/` folder.

### 4. Preview Production Build
```bash
npm run preview
```
Serves the generated `dist/` bundle locally to verify production readiness.

---

## 🔐 Environment Variables (`.env`)

Copy `.env.example` to `.env` if local environment overrides are required:

```bash
cp .env.example .env
```

> **Security Notice:** All variables starting with `VITE_` are publicly accessible in the client bundle. Never store private API secrets, SMTP passwords, or database credentials in frontend code.

---

## 📧 Appointment & Contact Email Integration Roadmap

Currently, submitting the Appointment or Contact forms prepares the request cleanly and displays:
> *"Your request has been prepared. Email submission will be available soon."*

When configuring live email delivery in a future sprint:
1. Use a serverless function (e.g., Vercel / Netlify / Cloudflare Workers) OR a provider SDK that does not expose private keys.
2. Update `src/services/appointmentService.js` and `src/services/contactService.js` to dispatch the request to the endpoint.

---

## 📜 License & Medical Disclaimer

All medical content, qualifications, and credentials belong to **Dr. Md. Jubayer Ahmed Saddam**.
Website created for professional healthcare communication and public awareness.
