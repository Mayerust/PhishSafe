
# PhishSafe Backend

This is the backend server for the PhishSafe Chrome extension. It provides API endpoints for phishing detection and data breach checking.

## Setup and Installation

### Prerequisites

- Node.js (v14 or newer)
- npm or yarn

### Installation & Deployment

1. Install the dependencies:

```bash
npm install
```

2. Start the server:

```bash
npm start
```

The server will run on http://localhost:3000 by default.

### Note: No Build Required

This is a Node.js backend application that doesn't require a build step. Simply install dependencies and run the server.

## API Endpoints

### Check URL for Phishing

```
POST /api/check-url
```

Request body:
```json
{
  "url": "https://example.com"
}
```

Response:
```json
{
  "isPhishing": false,
  "score": 0.2,
  "confidence": "Low",
  "reasons": ["No suspicious patterns detected"]
}
```

### Check Email for Data Breaches

```
POST /api/check-breach
```

Request body:
```json
{
  "email": "user@example.com"
}
```

Response:
```json
{
  "breached": false,
  "breachCount": 0,
  "breaches": [],
  "message": "Good news! No breaches found for this email."
}
```

## Development

For development with auto-reload:

```bash
npm run dev
```

## Note

This is a demonstration implementation for hackathon purposes. In a production environment, you would want to:

1. Add proper authentication
2. Use a real HaveIBeenPwned API integration with an appropriate API key
3. Implement rate limiting
4. Add more sophisticated phishing detection algorithms
5. Add proper error handling and logging
6. Set up HTTPS
