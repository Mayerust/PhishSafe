
// Content script runs in the context of the web page
console.log('PhishSafe content script loaded');

// Monitor all link clicks
document.addEventListener('click', async (event) => {
  // Check if a link was clicked
  const link = event.target.closest('a');
  
  if (link && link.href && !link.href.startsWith('javascript:')) {
    // Get the URL from the link
    const url = link.href;
    
    // Send the URL to the background script for checking
    chrome.runtime.sendMessage(
      { action: 'checkUrl', url },
      (response) => {
        if (chrome.runtime.lastError) {
          console.error('Error sending message:', chrome.runtime.lastError);
          return;
        }
        
        // If the link is identified as phishing, prevent navigation
        if (response && response.isPhishing) {
          event.preventDefault();
          event.stopPropagation();
          console.log('Prevented navigation to phishing site:', url);
          
          // Background script will handle redirection to warning page
        }
      }
    );
  }
});

// Also monitor form submissions
document.addEventListener('submit', async (event) => {
  const form = event.target;
  
  // Check if the form has password fields - common in phishing targets
  const hasPasswordField = form.querySelector('input[type="password"]');
  
  if (hasPasswordField) {
    const actionUrl = form.action || window.location.href;
    
    // Send the form action URL to the background script for checking
    chrome.runtime.sendMessage(
      { action: 'checkUrl', url: actionUrl },
      (response) => {
        if (chrome.runtime.lastError) {
          console.error('Error sending message:', chrome.runtime.lastError);
          return;
        }
        
        // If the form submission is to a phishing site, prevent it
        if (response && response.isPhishing) {
          event.preventDefault();
          event.stopPropagation();
          console.log('Prevented form submission to phishing site:', actionUrl);
          
          // Background script will handle redirection to warning page
        }
      }
    );
  }
});
