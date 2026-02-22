# Lister

A stock watchlist app built with Angular. Search for stocks by symbol or name, add them to your watchlist, and view details. Data is powered by the [Finnhub](https://finnhub.io/) API.

## Features

- **Stock search** — Search by symbol or company name with live suggestions
- **Watchlist** — Save symbols and view them on your dashboard
- **Stock details** — View details for any symbol via `/symbol/:symbol`

## Prerequisites

- **Node.js** 20+ (22 recommended)
- **npm** (or your preferred package manager)

## Setup

1. Clone the repo and install dependencies:

   ```bash
   npm install
   ```

2. Create a `.env` file in the project root with your Finnhub API key:

   ```bash
   FINNHUB_API_KEY=your_api_key_here
   ```

   Get a free API key at [finnhub.io](https://finnhub.io/).

## How to run

### Local development

Start the dev server:

```bash
npm start
```

Or:

```bash
ng serve
```

Open **http://localhost:4200/** in your browser. The app will reload when you change source files.
