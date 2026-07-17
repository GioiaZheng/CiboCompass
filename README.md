# CiboCompass

[![CI](https://github.com/GioiaZheng/CiboCompass/actions/workflows/ci.yml/badge.svg)](https://github.com/GioiaZheng/CiboCompass/actions/workflows/ci.yml)
[![Secret scan](https://github.com/GioiaZheng/CiboCompass/actions/workflows/secret-scan.yml/badge.svg)](https://github.com/GioiaZheng/CiboCompass/actions/workflows/secret-scan.yml)

🚀 Full-stack mobile app for international students in Italy

CiboCompass is a **full-stack mobile application** designed to help users understand restaurant menus and make informed food choices across cultures.

The system combines a **React Native (Expo) frontend** with a **Go-based backend API**, supporting real-time dish information, personalized ratings, and offline-first interaction.

---

# Highlights

- 📱 Cross-platform mobile app built with React Native + Expo  
- ⚙️ Backend API implemented in Go with SQLite persistence  
- 🌍 Cultural-aware exploration based on nationality  
- 💾 Offline-first rating system with local caching and sync  
- 🎯 User-centered design following HCI principles  

---

# System Architecture

```

Mobile App (React Native)
↓
REST API (Go)
↓
SQLite Database

```

---

# System Design

### Data Flow

1. User searches or selects a dish in the mobile app  
2. App sends request to backend API  
3. Backend retrieves dish data from SQLite  
4. Response returned to mobile client  
5. User submits rating  
6. Rating stored locally (offline-first)  
7. Synced to backend when connection is available  

---

### Design Decisions

- **Offline-first architecture**  
  Ratings are cached locally to ensure usability without network connectivity.
  The current local-cache behavior and the planned durable retry queue are
  documented in [docs/offline-sync-state-diagram.md](docs/offline-sync-state-diagram.md).

- **Lightweight backend (Go)**  
  Chosen for efficient concurrency and low overhead.

- **REST API design**  
  Stateless endpoints for scalability and easy integration.

- **SQLite database**  
  Simple and fast for development and local persistence.

---

### Offline Sync State

The offline rating lifecycle is documented in [docs/offline-sync-state-diagram.md](docs/offline-sync-state-diagram.md). The app stores user ratings and pending feedback submissions locally with `AsyncStorage`, then submits idempotent feedback requests to the backend when the request is available.

---

### Screenshots and Demo

Visual files are stored with explicit names:

- [docs/screenshots/cibocompass-dish-detail-screen.svg](docs/screenshots/cibocompass-dish-detail-screen.svg)
- [docs/screenshots/cibocompass-rating-country-screen.svg](docs/screenshots/cibocompass-rating-country-screen.svg)
- [docs/demo/cibocompass-demo.gif](docs/demo/cibocompass-demo.gif)

---

### Future Improvements

- Replace SQLite with PostgreSQL for scalability  
- Add authentication system (JWT-based users)  
- Introduce recommendation engine (collaborative filtering)  
- Deploy backend with Docker and cloud services  

---

# Key Features

### 🌍 Cultural Food Exploration
- Browse dishes across different countries  
- Switch nationality to compare preferences  

### ⭐ Rating System
- Submit ratings per dish  
- View aggregated ratings by country  

### 🥗 Dietary Awareness
- Display ingredients, calories, allergens  
- Highlight vegetarian / gluten-free options  

### 💾 Offline Support
- Ratings stored locally when offline  
- Synced automatically when backend is available  

---

# API Endpoints

| Method | Endpoint        | Description              |
|--------|----------------|--------------------------|
| GET    | /v1/dishes     | Fetch dish information   |
| POST   | /v1/dishes     | Create a dish            |
| GET    | /v1/dishes/:dishName | Fetch dish details for a nationality |
| POST   | /v1/dishes/:dishName/feedback | Submit dish feedback |

---

# Tech Stack

| Layer        | Technology |
|--------------|------------|
| **Frontend** | React Native, Expo |
| **Backend**  | Go (Golang), REST API |
| **Database** | SQLite |
| **UX**       | HCI principles, usability testing |

---

# Quickstart

```bash
git clone https://github.com/GioiaZheng/CiboCompass.git
cd CiboCompass

npm install
npm run start
```

Expected output:

```text
Starting project at .../CiboCompass
Metro waiting on exp://...
› Press a │ open Android
› Press i │ open iOS simulator
› Press w │ open web
```

Backend:

```bash
cd backend
go run ./cmd/api
```

Expected output:

```text
starting development server on 0.0.0.0:4000
```

---

# Project Structure

```

CiboCompass/
├── assets/          # Images, icons
├── backend/         # Go API
├── App.js           # Main app
├── package.json
└── README.md

```

---

# Why This Project

Food is one of the biggest barriers for international students.

This project focuses on:

- reducing language friction in menus  
- improving decision-making with structured food data  
- adapting recommendations across cultural preferences  

---

# Course Context

Human–Computer Interaction (HCI)  
Sapienza University of Rome — 2023–2024  

---

# License

MIT License © 2025
