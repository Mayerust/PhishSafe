
// PhishSafe background script
const BACKEND_URL = 'http://localhost:3000'; // Local backend server

/**
 * Detects if a URL is potentially a phishing site
 * by calling our backend API
 */
async function detectPhishing(url) {
  try {
    console.log('Checking URL:', url);
    
    // Skip checking the warning page itself
    if (url.includes('warning.html')) {
      console.log('Skipping check for warning page');
      return { isPhishing: false };
    }
    
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
  
  // Skip checking the warning page itself
  if (url.includes('warning.html')) {
    console.log('Skipping check for warning page');
    return { isPhishing: false };
  }
  
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
      breached: Math.random() > 0.7, // 30% chance of mock breach
      breachCount: Math.floor(Math.random() * 3) + 1,
      message: Math.random() > 0.7 ? 
        "Your email appears in some known data breaches. You should change your password." : 
        "Your email doesn't appear in known data breaches.",
      breaches: Math.random() > 0.7 ? [
        {name: "ExampleSite", breachDate: "2023-05-15", dataClasses: ["email", "password"]},
        {name: "DemoBreak", breachDate: "2022-11-03", dataClasses: ["email", "username"]}
      ] : []
    };
  }
}

// Main listener for tab updates
chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  // Only run when the page is starting to load
  if (changeInfo.status === 'loading' && tab.url && !tab.url.startsWith('chrome://')) {
    try {
      console.log("Tab updated:", tab.url);
      
      // Skip checking the warning page itself and any variations with query params
      if (tab.url.includes('warning.html')) {
        console.log('Skipping check for warning page');
        return;
      }
      
      const result = await detectPhishing(tab.url);
      
      if (result.isPhishing) {
        console.log('Phishing site detected:', tab.url);
        
        // Store the suspicious URL and phishing info for the warning page
        chrome.storage.local.set({ 
          suspiciousUrl: tab.url,
          phishingScore: result.score,
          phishingConfidence: result.confidence,
          phishingReasons: result.reasons
        }, function() {
          console.log("Stored phishing data in local storage");
          
          // Redirect to the warning page
          chrome.tabs.update(tabId, { 
            url: chrome.runtime.getURL('warning.html') 
          });
        });
      }
    } catch (error) {
      console.error('Error detecting phishing:', error);
    }
  }
});

// Listen for messages from content script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log("Message received in background script:", message);
  
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
  
  if (message.action === 'returnToSafety') {
    console.log("Return to safety message received");
    try {
      chrome.tabs.update(sender.tab.id, { 
        url: chrome.runtime.getURL('warning.html?status=safe') 
      });
      sendResponse({ success: true });
    } catch (error) {
      console.error("Error returning to safety:", error);
      sendResponse({ success: false, error: error.message });
    }
    return true;
  }
});

// Add installation event listener to set up extension
chrome.runtime.onInstalled.addListener(function() {
  console.log("PhishSafe extension installed");
  
  // Create dynamic icons
  try {
    createExtensionIcons();
  } catch (e) {
    console.error("Error creating extension icons:", e);
  }
});

// Function to create extension icons programmatically if needed
function createExtensionIcons() {
  // Implementation will be handled by icons.js
  console.log("Extension icons will be created by icons.js");
}
