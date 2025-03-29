
// Mock phishing detection function (will be replaced with ML model API call)
async function detectPhishing(url) {
  console.log('Checking URL:', url);
  
  // For demonstration purposes: random URLs will be flagged as phishing
  // In a real implementation, this would call your ML model API
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
  
  return { isPhishing, score: isPhishing ? 0.92 : 0.08 };
}

// Main listener for tab updates
chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  // Only run when the page is starting to load
  if (changeInfo.status === 'loading' && tab.url && !tab.url.startsWith('chrome://')) {
    try {
      const result = await detectPhishing(tab.url);
      
      if (result.isPhishing) {
        console.log('Phishing site detected:', tab.url);
        
        // Store the suspicious URL for the warning page
        chrome.storage.local.set({ 
          suspiciousUrl: tab.url,
          phishingScore: result.score
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
});
