# WellSociety Classes

Kurs-Buchungsseite für WellSociety – zweisprachig DE/EN mit Notion-Datenbank-Integration.

## Setup

1. `npm install`
2. `npm run dev`

## Environment Variables (Vercel)

| Variable | Beschreibung |
|----------|-------------|
| `NOTION_API_KEY` | Notion Integration Token (`secret_...`) |

## Struktur

- `src/App.jsx` – Haupt-App mit Kursplan und Buchungsformular
- `api/book.js` – Serverless API Route → speichert Buchungen in Notion
