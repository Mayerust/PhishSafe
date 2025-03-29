
# PhishSafe Chrome Extension

PhishSafe is an AI-powered Chrome extension designed to protect users from phishing attacks in real-time.

## Features

- **Real-time URL Monitoring**: Analyzes websites as you browse
- **AI-based Detection**: Uses machine learning to identify potential phishing sites
- **User-friendly Warnings**: Clean, informative warning page when threats are detected
- **Victim Assessment**: Helps users determine if they've been compromised
- **Guided Recovery**: Step-by-step recovery actions if credentials were exposed
- **Data Breach Checking**: Verify if your credentials have been leaked in known breaches

## Project Setup

### Development Environment

This project consists of two parts:
1. The frontend Chrome extension (React/TypeScript)
2. A backend server (Node.js/Express)

### Setting up the Backend

1. Navigate to the backend directory:
```sh
cd backend
```

2. Install dependencies:
```sh
npm install
```

3. Start the backend server:
```sh
npm start
```

The server will run on http://localhost:3000

### Setting up the Frontend

1. In a new terminal, install dependencies in the root directory:
```sh
npm install
```

2. Start the development server:
```sh
npm run dev
```

### Building the Extension

```sh
# Build the extension
npm run build
```

After building, you can load the extension in Chrome by:

1. Opening Chrome and navigating to `chrome://extensions/`
2. Enabling "Developer mode"
3. Clicking "Load unpacked" and selecting the `dist` folder

## How It Works

1. The Chrome extension monitors all URLs you visit
2. When a suspicious URL is detected, it sends the URL to the backend server
3. The backend analyzes the URL for phishing patterns
4. If phishing is detected, you're shown a warning page
5. You can assess if you've been compromised and take recovery actions

## Local Hackathon Setup

For a complete hackathon setup:

1. Start the backend server:
```sh
cd backend
npm install
npm start
```

2. In a new terminal, build the extension:
```sh
npm install
npm run build
```

3. Load the extension in Chrome from the `dist` folder

4. Browse to test sites (e.g., `https://fake-bank-login.com`) to trigger the phishing detection

## Future Development

- Integration with a real ML model API for more accurate phishing detection
- Implementation of advanced recovery tools
- Enhanced user education about phishing threats

## License

[MIT](LICENSE)
