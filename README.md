# Local Weather and Holiday Dashboard

## Project Overview

This project is part of **WAD621S – Web Application Development** at the **Namibia University of Science and Technology (NUST)**.

Our application, Local Weather & Holiday Dashboard, provides:

- Live Local Time and Date
- Real-time Weather Updates (via OpenWeather API / mock fallback), with custom city input and dynamic background changes based on weather conditions
- Upcoming Holidays List (loaded from holidays.json, with banner alerts for today's holidays)
- Weekend Countdown Timer

The dashboard combines HTML, CSS, JavaScript, and JSON to deliver an interactive and visually appealing interface, now enhanced with dark mode, PWA support and more.

## Team Members

- **Natanael N Treves** (Group Leader) – 224032143
- **Rejoice Kaulumah** – 224061135

## Technologies Used

- **HTML** – Structure and layout
- **CSS** – Styling, responsive design and theme switching
- **JavaScript** – Logic, API calls, dynamic updates, localStorage for preferences
- **JSON** – Holiday data
- **OpenWeather API** – For live weather
- **Service Worker & Manifest** – For Progressive Web App (PWA) support

## Project Files

- index.html: Main HTML structure
- styles.css: Styling and themes (light/dark)
- script.js: Logic for time, weather, holidays, countdown, dark mode and PWA registration
- holidays.json: List of Namibian public holidays (updated for 2025-2026, including special observances like the Burial of Sam Nujoma)
- manifest.json: PWA configuration
- sw.js: Service Worker for offline support
- background.jpg: Default light mode background image
- darktheme.jpg: Dark mode background image
- websiteIcon.png: Site icon displayed in the header
- icon.png: PWA install icon (192x192)

## How It Works

**Clock and Date:** Updates every second with a subtle pulse animation.

**Weekend Countdown:** Calculates days, hours, minutes, seconds left until Saturday midnight.

**Weather:** 
- Uses browser geolocation if allowed, with fallback to Windhoek, NA
- Allows manual city input via a form for custom locations
- Displays temperature, conditions, location, feels-like temperature, and emoji icons
- Dynamically changes the page background based on current weather (e.g sunny-bg.jpg for clear skies)

**Holidays:** Loads from holidays.json (sorted and displayed with countdown days), with a banner alert if today is a holiday.

**Dark Mode:** Toggle switch in header, persists via localStorage, with smooth transitions.

**PWA Support:** Enables installation as an app on devices, with basic offline caching via service worker.

## Setup & Usage

1. Clone or download the project files
2. Open index.html in any modern browser
3. OpenWeather API key in script.js: const OPENWEATHER_API_KEY = "fd45af88bc5343154a05dfc20d8b515e";
4. Ensure holidays.json and all images/files are in the same directory
5. For PWA: Access via a local server (e.g via VS Code Live Server) to enable installation prompt

## Features and UI Design

- Glassmorphism card layout with smooth hover effects
- Responsive design for mobile and desktop
- Dynamic animations (e.g time pulse, weather icon tilt)
- Dark mode toggle with smooth transitions and theme-specific backgrounds
- Custom weather city input form
- Holiday banner alerts for current dates
- Dynamic body background based on weather
- Site icon in header for branding
- PWA support for installable, offline-capable experience

## Future Improvements

- Support multiple countries' holidays
- Enhance PWA with more advanced offline features