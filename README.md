
# PhishSafe Chrome Extension

PhishSafe is an AI-powered Chrome extension designed to protect users from phishing attacks in real-time.

## Features

- **Real-time URL Monitoring**: Analyzes websites as you browse
- **AI-based Detection**: Uses machine learning to identify potential phishing sites
- **User-friendly Warnings**: Clean, informative warning page when threats are detected
- **Victim Assessment**: Helps users determine if they've been compromised
- **Guided Recovery**: Step-by-step recovery actions if credentials were exposed

## Project Setup

### Development Environment

This project uses Vite with React and TypeScript for the frontend, and will eventually incorporate a Python backend for the ML model.

```sh
# Install dependencies
npm install

# Start the development server
npm run dev
```

### Extension Structure

- `public/manifest.json`: Chrome extension configuration
- `public/background.js`: Background script for monitoring URLs
- `public/content.js`: Content script for page interactions
- `src/components/`: React components for the warning page UI

## Building the Extension

```sh
# Build the extension
npm run build
```

After building, you can load the extension in Chrome by:

1. Opening Chrome and navigating to `chrome://extensions/`
2. Enabling "Developer mode"
3. Clicking "Load unpacked" and selecting the `dist` folder

## Future Development

- Integration with a real ML model API for more accurate phishing detection
- Implementation of advanced recovery tools
- Enhanced user education about phishing threats

## License

[MIT](LICENSE)
