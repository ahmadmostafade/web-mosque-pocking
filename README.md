# IBF Pocking — Mosque Community Website

> **Live:** [ibf-pocking.de](https://ibf-pocking.de)

Full-stack community website for **Islamisches Bildungsforum Pocking e.V.** — a mosque in Pocking, Bavaria. Built to support a €60,000 fundraising campaign for purchasing and renovating their building, while serving as the digital hub for the community.


## Features

### Public Website

| Feature | Details |
|---|---|
| **Live Donation Tracking** | Animated progress bar, recent donations wall, auto-refresh every 30s |
| **SEPA QR Code** | EPC-standard QR code for instant bank transfers via mobile banking apps |
| **Prayer Times** | Daily Adhan times (Aladhan API, 1h cache) + community-set Iqamah offsets + Jumu'ah Khutba time |
| **Media Gallery** | Filterable image/video grid (Vorher/Nachher/Allgemein) with lightbox & keyboard navigation |
| **Contact Form** | Validated form with honeypot spam protection |
| **About / Story** | Full project history: acquisition, renovation status, volunteer work |
| **GDPR Compliant** | Cookie consent banner, full Datenschutzerklärung, Impressum (§5 TMG), OpenStreetMap instead of Google Maps |
| **Bilingual Elements** | German UI with Arabic text for Quranic verses, prayer names, and mosque branding |


### Admin Panel (`/admin`)

| Feature | Details |
|---|---|
| **Donation Management** | Add donations (named/anonymous), set initial amount, view stats, reset all |
| **Prayer Time Editing** | Configure Iqamah offsets per prayer, set Jumu'ah Khutba time |
| **Homepage Layout Toggle** | Switch between Classic (V1) and Modern (V2) homepage layouts |
| **Password Management** | Secure password change with re-authentication |


## Admin Guide

1. **Login** — Go to [ibf-pocking.de/admin/login](https://ibf-pocking.de/admin/login)
2. **Dashboard** — Overview of donation progress + quick links
3. **Donations** — Add new donations as they come in via bank transfer. The progress bar updates live on the public site
4. **Prayer Times** — Update Iqamah offsets when the mosque schedule changes. Jumu'ah Khutba time is set separately
5. **Homepage** — Toggle between two layout styles from the dashboard
6. **Password** — Change your admin password under `/admin/passwort`