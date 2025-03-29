
// PhishSafe background script
const BACKEND_URL = 'http://localhost:3000'; // Local backend server

/**
 * Detects if a URL is potentially a phishing site
 * by calling our backend API
 */
async function detectPhishing(url) {
  try {
    console.log('Checking URL:', url);
    
    // Call our backend API
    const response = await fetch(`${BACKEND_URL}/api/check-url`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url }),
    });
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }
    
    const result = await response.json();
    console.log('Phishing detection result:', result);
    
    return result;
  } catch (error) {
    console.error('Error in phishing detection:', error);
    
    // Fallback to the mock detection if the API fails
    return mockDetectPhishing(url);
  }
}

/**
 * Mock detection for fallback (in case the backend is not available)
 */
function mockDetectPhishing(url) {
  console.log('Using mock detection for URL:', url);
  
  // For demonstration purposes: specific URLs will be flagged as phishing
  const knownPhishingDomains = [
    'phishing-example.com',
    'fake-bank-login.com',
    'secure-login-verify.com',
    'account-verify-login.com'
  ];
  
  // For testing - if URL contains any of these keywords, flag as phishing
  const isPhishing = knownPhishingDomains.some(domain => url.includes(domain)) || 
                    (url.includes('phish') && !url.includes('phishsafe')) || 
                    Math.random() < 0.1; // 10% random chance for testing
  
  return { 
    isPhishing, 
    score: isPhishing ? 0.92 : 0.08,
    confidence: isPhishing ? "High" : "Low",
    reasons: isPhishing ? ['Suspicious domain detected'] : ['No suspicious patterns detected']
  };
}

/**
 * Checks if an email has been in a data breach
 * by calling our backend API
 */
async function checkBreachedCredentials(email) {
  try {
    console.log('Checking breached credentials for:', email);
    
    // Call our backend API
    const response = await fetch(`${BACKEND_URL}/api/check-breach`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }
    
    const result = await response.json();
    console.log('Breach check result:', result);
    
    return result;
  } catch (error) {
    console.error('Error checking breached credentials:', error);
    
    // Fallback to mock result if the API fails
    return {
      breached: false,
      error: true,
      message: `Error checking breach status: ${error.message}`,
      breaches: []
    };
  }
}

// Main listener for tab updates
chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  // Only run when the page is starting to load
  if (changeInfo.status === 'loading' && tab.url && !tab.url.startsWith('chrome://')) {
    try {
      const result = await detectPhishing(tab.url);
      
      if (result.isPhishing) {
        console.log('Phishing site detected:', tab.url);
        
        // Store the suspicious URL and phishing info for the warning page
        chrome.storage.local.set({ 
          suspiciousUrl: tab.url,
          phishingScore: result.score,
          phishingConfidence: result.confidence,
          phishingReasons: result.reasons
        });
        
        // Redirect to the warning page
        chrome.tabs.update(tabId, { 
          url: chrome.runtime.getURL('warning.html') 
        });
      }
    } catch (error) {
      console.error('Error detecting phishing:', error);
    }
  }
});

// Listen for messages from content script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'checkUrl') {
    detectPhishing(message.url)
      .then(result => sendResponse(result))
      .catch(error => {
        console.error('Error in phishing detection:', error);
        sendResponse({ isPhishing: false, error: error.message });
      });
    return true; // Keep the message channel open for async response
  }
  
  if (message.action === 'checkBreachedCredentials') {
    checkBreachedCredentials(message.email)
      .then(result => sendResponse(result))
      .catch(error => {
        console.error('Error checking breached credentials:', error);
        sendResponse({ breached: false, error: error.message });
      });
    return true; // Keep the message channel open for async response
  }
});
