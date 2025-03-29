
const axios = require('axios');

// This is a mock implementation of a breach checker
// In a real-world scenario, you would use a proper API like HaveIBeenPwned
// which requires authentication and proper API key management

async function checkBreachedCredentials(email) {
  try {
    console.log(`Checking breach status for: ${email}`);
    
    // For hackathon/demo purposes, we'll simulate API responses
    // based on email patterns to avoid hitting real APIs
    
    // Email patterns that will return "breached" status
    const breachedPatterns = [
      'test', 'demo', 'hack', 'breach', 'leaked', 'compromised',
      'john.doe', 'jane.doe', 'admin', 'user'
    ];
    
    const isBreached = breachedPatterns.some(pattern => 
      email.toLowerCase().includes(pattern)
    );
    
    // Add random delays to simulate API latency (200-800ms)
    await new Promise(resolve => setTimeout(resolve, 200 + Math.random() * 600));
    
    if (isBreached) {
      // Simulate finding breaches
      const breachCount = Math.floor(Math.random() * 5) + 1;
      const breaches = Array.from({ length: breachCount }, (_, i) => ({
        name: ['LinkedIn', 'Adobe', 'Dropbox', 'Yahoo', 'MyFitnessPal', 'Canva', 'Experian'][i % 7],
        domain: ['linkedin.com', 'adobe.com', 'dropbox.com', 'yahoo.com', 'myfitnesspal.com', 'canva.com', 'experian.com'][i % 7],
        breachDate: new Date(Date.now() - (Math.random() * 365 * 24 * 60 * 60 * 1000)).toISOString().split('T')[0],
        dataClasses: ['Email addresses', 'Passwords', 'Names', 'Phone numbers', 'Physical addresses']
          .sort(() => 0.5 - Math.random())
          .slice(0, Math.floor(Math.random() * 4) + 1),
        pwnCount: Math.floor(Math.random() * 1000000)
      }));
      
      return {
        breached: true,
        breachCount,
        breaches,
        message: `Found ${breachCount} breach${breachCount > 1 ? 'es' : ''}. Your information may be compromised.`
      };
    } else {
      // No breach found
      return {
        breached: false,
        breachCount: 0,
        breaches: [],
        message: "Good news! No breaches found for this email."
      };
    }
  } catch (error) {
    console.error(`Error checking breach status: ${error.message}`);
    return {
      error: true,
      message: `Failed to check breach status: ${error.message}`
    };
  }
}

module.exports = { checkBreachedCredentials };
