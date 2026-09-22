# lister

A stock watchlist app built with Angular. Search for stocks by symbol or company name, add them to your watchlist, and view details. Powered by the [Finnhub](https://finnhub.io/) API.

## Features

- **Stock search** — live suggestions by symbol or company name
- **Watchlist** — save symbols and view them on your dashboard
- **Stock detail view** — visit `/symbol/:symbol` for any ticker
- **Containerized** — Dockerfile included for easy self-hosting

## Stack

| Layer    | Tech                    |
|----------|-------------------------|
| Frontend | Angular 17 + TypeScript |
| Styling  | CSS                     |
| API      | Finnhub                 |
| Deploy   | Docker                  |

## Prerequisites

- Node.js 20+ (22 recommended)
- npm
- A free [Finnhub API key](https://finnhub.io/)

## Setup

```bash
npm install

# Create .env in the project root
echo "FINNHUB_API_KEY=your_api_key_here" > .env
```

## Running locally

```bash
npm start
# or
ng serve
```

Open [http://localhost:4200](http://localhost:4200). The app hot-reloads on file changes.

## Building

```bash
npm run build
```

Output is in `dist/`. Run `npm run build -- --configuration production` for a production build.

## Docker

```bash
docker build -t lister .
docker run -p 4200:4200 -e FINNHUB_API_KEY=your_key lister
```