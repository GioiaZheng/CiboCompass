# CiboCompass

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

- **Lightweight backend (Go)**  
  Chosen for efficient concurrency and low overhead.

- **REST API design**  
  Stateless endpoints for scalability and easy integration.

- **SQLite database**  
  Simple and fast for development and local persistence.

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
| POST   | /v1/ratings    | Submit user rating       |

---

# Tech Stack

| Layer        | Technology |
|--------------|------------|
| **Frontend** | React Native, Expo |
| **Backend**  | Go (Golang), REST API |
| **Database** | SQLite |
| **UX**       | HCI principles, usability testing |

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
