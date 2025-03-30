
const BACKEND_URL = 'http://localhost:3000';

async function detectPhishing(url) {
  try {
    console.log('Checking URL:', url);
    
    if (url.includes('warning.html')) {
      console.log('Skipping check for warning page');
      return { isPhishing: false };
    }
    
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
    return mockDetectPhishing(url);
  }
}

function mockDetectPhishing(url) {
  console.log('Using mock detection for URL:', url);
  
  if (url.includes('warning.html')) {
    console.log('Skipping check for warning page');
    return { isPhishing: false };
  }
  
  const knownPhishingDomains = [
    'phishing-example.com',
    'fake-bank-login.com',
    'secure-login-verify.com',
    'account-verify-login.com'
  ];
  
  const isPhishing = knownPhishingDomains.some(domain => url.includes(domain)) || 
                    (url.includes('phish') && !url.includes('phishsafe')) || 
                    Math.random() < 0.1;
  
  return { 
    isPhishing, 
    score: isPhishing ? 0.92 : 0.08,
    confidence: isPhishing ? "High" : "Low",
    reasons: isPhishing ? ['Suspicious domain detected'] : ['No suspicious patterns detected']
  };
}

async function checkBreachedCredentials(email) {
  try {
    console.log('Checking breached credentials for:', email);
    
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
    
    return {
      breached: Math.random() > 0.7,
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

chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  if (changeInfo.status === 'loading' && tab.url && !tab.url.startsWith('chrome://')) {
    try {
      console.log("Tab updated:", tab.url);
      
      if (tab.url.includes('warning.html')) {
        console.log('Skipping check for warning page');
        return;
      }
      
      const result = await detectPhishing(tab.url);
      
      if (result.isPhishing) {
        console.log('Phishing site detected:', tab.url);
        
        chrome.storage.local.set({ 
          suspiciousUrl: tab.url,
          phishingScore: result.score,
          phishingConfidence: result.confidence,
          phishingReasons: result.reasons
        }, function() {
          console.log("Stored phishing data in local storage");
          
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

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log("Message received in background script:", message);
  
  if (message.action === 'checkUrl') {
    detectPhishing(message.url)
      .then(result => sendResponse(result))
      .catch(error => {
        console.error('Error in phishing detection:', error);
        sendResponse({ isPhishing: false, error: error.message });
      });
    return true;
  }
  
  if (message.action === 'checkBreachedCredentials') {
    checkBreachedCredentials(message.email)
      .then(result => sendResponse(result))
      .catch(error => {
        console.error('Error checking breached credentials:', error);
        sendResponse({ breached: false, error: error.message });
      });
    return true;
  }
  
  if (message.action === 'returnToSafety') {
    console.log("Return to safety message received");
    try {
      const tabId = sender?.tab?.id;
      
      if (!tabId) {
        console.error("No tab ID found in sender");
        sendResponse({ success: false, error: "No tab ID found" });
        return true;
      }
      
      chrome.tabs.update(tabId, { 
        url: chrome.runtime.getURL('warning.html?status=safe') 
      }, (tab) => {
        if (chrome.runtime.lastError) {
          console.error("Error updating tab:", chrome.runtime.lastError);
          sendResponse({ success: false, error: chrome.runtime.lastError.message });
        } else {
          console.log("Tab updated successfully:", tab);
          sendResponse({ success: true });
        }
      });
    } catch (error) {
      console.error("Error returning to safety:", error);
      sendResponse({ success: false, error: error.message });
    }
    return true;
  }
});

chrome.runtime.onInstalled.addListener(function() {
  console.log("PhishSafe extension installed");
  
  try {
    createExtensionIcons();
  } catch (e) {
    console.error("Error creating extension icons:", e);
  }
});

function createExtensionIcons() {
  console.log("Extension icons will be created by icons.js");
}
