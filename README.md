# CiboCompass

CiboCompass is a React Native + Expo Go mobile app that helps international students in Italy quickly understand restaurant menus. The app shows dish details (ingredients, calories, allergens), lets you switch nationalities to see how tastes vary globally, and collects ratings and feedback to improve recommendations.

## Table of Contents
- [Features](#features)
- [Prerequisites](#prerequisites)
- [Quick Start](#quick-start)
- [Running the Backend API](#running-the-backend-api)
- [Configuring the Mobile App](#configuring-the-mobile-app)
- [Using the App](#using-the-app)
- [Project Structure](#project-structure)
- [Contributors](#contributors)
- [Course Information](#course-information)
- [License](#license)

## Features
- 🌍 **Cultural food discovery** — browse traditional dishes from multiple countries.
- ⭐ **User ratings** — rate each dish and see country-specific averages.
- 🥗 **Dietary filters** — highlights gluten-free or vegetarian options when available.
- 🧭 **Intuitive navigation** — smooth scrolling, quick country switching, and saved preferences.
- 💬 **Feedback loop** — ratings are cached locally and sent to the backend for personalization.

## Prerequisites
- **Node.js** 18+ and **npm**.
- **Expo Go** app installed on your Android/iOS device.
- Optional: **Go 1.21+** to run the local backend API (provides dish data and ratings).

## Quick Start
1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the Expo development server:
   ```bash
   npm start
   ```
3. Scan the QR code shown in the terminal/browser with **Expo Go**. The app will load on your device or emulator.

If you also want live dish data and rating persistence, run the backend API first (see below) and configure the app to point to it.

## Running the Backend API
The backend is a small Go API that serves dish information and stores ratings in SQLite.

1. Install Go dependencies and start the server:
   ```bash
   cd backend
   go run ./cmd/api
   ```
2. The API listens on **http://localhost:4000** by default. If you run it on a different machine, ensure your phone/emulator can reach that IP.

> The Expo app expects the API at `http://<YOUR_IP>:4000/v1`.

## Configuring the Mobile App
Set the API base URL in `App.js` so the mobile client can reach your backend:

```js
const API_BASE_URL = 'http://<YOUR_IP_ADDRESS>:4000/v1';
```

Replace `<YOUR_IP_ADDRESS>` with the LAN IP of the machine running the Go server (e.g., `192.168.0.10`). Save the file and reload the app via Expo.

## Using the App
1. **Choose your nationality**: tap the flag button to select a country; preferences are saved locally.
2. **Search a dish**: type a dish name (e.g., “Pizza Margherita”) and tap **Search** to fetch details.
3. **Read the details**: view ingredients, calories, allergens, and global “liked by” percentages; expand/collapse ingredients as needed.
4. **Switch countries**: change nationality to see how ratings differ per audience; the app refreshes the current dish automatically.
5. **Rate the dish**: tap the stars to submit your rating. Ratings are cached offline and sent to the API when available.
6. **Resume where you left off**: the last viewed dish and your ratings persist between sessions.

## Project Structure
```
CiboCompass/
├── assets/              # Images, icons, fonts
├── backend/             # Go API (dish data and ratings)
├── App.js               # Main React Native app
├── app.json             # Expo configuration
├── index.js             # React Native entry point
├── package.json         # Dependencies and npm scripts
└── README.md            # Documentation
```

## Contributors
| Name | Role | Contribution |
| --- | --- | --- |
| **Gioia Zheng** | Frontend Development & Usability Testing | Designed and implemented main screens, fixed gluten-free and icon sensitivity issues, conducted user testing |
| **Bery Nil Atabey** | Frontend Development | Implemented navigation and rating logic |
| **Diastart Dias** | Data & Integration | Integrated backend logic and managed country-switching features |
| **Nursultan Dias** | UI Design & QA | Designed visual elements and maintained UX consistency |

> Some contributors participated without GitHub accounts. Their names are listed to acknowledge their roles.

## Course Information
- **Course:** Human–Computer Interaction (HCI)
- **Degree Program:** Applied Computer Science and Artificial Intelligence
- **University:** Sapienza University of Rome
- **Academic Year:** 2023–2024

## License
MIT License © 2025 — created for the Human–Computer Interaction course at Sapienza University of Rome.
