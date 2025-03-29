
const axios = require('axios');
const { parse } = require('node-html-parser');
const url = require('url');

// Phishing detection features
const PHISHING_INDICATORS = {
  suspiciousTerms: [
    'login', 'signin', 'verify', 'secure', 'account', 'update', 'confirm',
    'banking', 'password', 'credential', 'official'
  ],
  suspiciousTLDs: ['.tk', '.ml', '.ga', '.cf', '.gq', '.xyz', '.top', '.work', '.date'],
  suspiciousURLPatterns: [
    /ip(?:v[46])?(?:[\/.-][^\/\s]+)+/i, // IP addresses
    /(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-9][a-z0-9-]{0,61}[a-z0-9]-(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-9][a-z0-9-]{0,61}[a-z0-9]/i, // Double domain patterns
    /https?:\/\/[^\/]*@/i, // URLs with @ symbols
    /https?:\/\/.*?\.(?:[^.\/]+)\.[^.\/]+\.[^.\/]+\.[^.\/]+/i, // Multiple subdomains
  ],
  brandNames: [
    'paypal', 'apple', 'amazon', 'microsoft', 'google', 'facebook', 'instagram',
    'netflix', 'bank', 'chase', 'wellsfargo', 'citi', 'coinbase', 'binance'
  ]
};

// Top legitimate domains (for comparison)
const LEGITIMATE_DOMAINS = [
  'google.com', 'facebook.com', 'youtube.com', 'twitter.com', 'instagram.com',
  'linkedin.com', 'apple.com', 'microsoft.com', 'amazon.com', 'netflix.com',
  'paypal.com', 'chase.com', 'wellsfargo.com', 'bankofamerica.com', 'citi.com',
  'capitalone.com', 'coinbase.com', 'binance.com', 'gmail.com', 'yahoo.com'
];

// Known phishing domains for demo/testing purposes
const KNOWN_PHISHING_DOMAINS = [
  'phishing-example.com',
  'fake-bank-login.com',
  'secure-login-verify.com',
  'account-verify-login.com'
];

/**
 * Calculates phishing score based on URL structure
 */
function analyzeURLStructure(urlToCheck) {
  const parsedUrl = new URL(urlToCheck);
  let score = 0;
  let reasons = [];
  
  // Check for suspicious TLDs
  const domain = parsedUrl.hostname;
  if (PHISHING_INDICATORS.suspiciousTLDs.some(tld => domain.endsWith(tld))) {
    score += 0.2;
    reasons.push('Suspicious top-level domain detected');
  }
  
  // Check for suspicious URL patterns
  if (PHISHING_INDICATORS.suspiciousURLPatterns.some(pattern => pattern.test(urlToCheck))) {
    score += 0.3;
    reasons.push('Suspicious URL pattern detected');
  }
  
  // Check for IP address instead of domain name
  if (/^https?:\/\/\d+\.\d+\.\d+\.\d+/.test(urlToCheck)) {
    score += 0.3;
    reasons.push('IP address used instead of domain name');
  }
  
  // Check for excessive subdomains
  const subdomains = domain.split('.');
  if (subdomains.length > 3) {
    score += 0.1;
    reasons.push('Excessive subdomains detected');
  }
  
  // Check for brand names in non-official domains
  for (const brand of PHISHING_INDICATORS.brandNames) {
    if (domain.includes(brand) && !LEGITIMATE_DOMAINS.includes(domain)) {
      score += 0.25;
      reasons.push(`Brand name "${brand}" in unofficial domain`);
      break;
    }
  }
  
  // Check for suspicious terms in URL
  for (const term of PHISHING_INDICATORS.suspiciousTerms) {
    if (urlToCheck.toLowerCase().includes(term)) {
      score += 0.05;
      reasons.push(`Suspicious term "${term}" in URL`);
      break;
    }
  }
  
  // Check for excessive URL length
  if (urlToCheck.length > 100) {
    score += 0.1;
    reasons.push('Excessively long URL');
  }
  
  return { score, reasons };
}

/**
 * Analyze page content for phishing indicators
 */
async function analyzePageContent(urlToCheck) {
  let score = 0;
  let reasons = [];
  
  try {
    // Fetch the URL content
    const response = await axios.get(urlToCheck, {
      timeout: 5000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });
    
    // Parse HTML
    const root = parse(response.data);
    
    // Check for password fields
    const passwordFields = root.querySelectorAll('input[type="password"]');
    if (passwordFields.length > 0) {
      score += 0.2;
      reasons.push('Page contains password input fields');
    }
    
    // Check for login forms
    const forms = root.querySelectorAll('form');
    if (forms.length > 0) {
      score += 0.1;
      reasons.push('Page contains forms');
    }
    
    // Check for suspicious terms in content
    const pageText = root.text.toLowerCase();
    let suspiciousTermsFound = 0;
    
    for (const term of PHISHING_INDICATORS.suspiciousTerms) {
      if (pageText.includes(term)) {
        suspiciousTermsFound++;
      }
    }
    
    if (suspiciousTermsFound >= 3) {
      score += 0.2;
      reasons.push(`Multiple suspicious terms found in page content (${suspiciousTermsFound})`);
    }
    
    // Check for brand names in content but not in domain
    const parsedUrl = new URL(urlToCheck);
    const domain = parsedUrl.hostname;
    
    for (const brand of PHISHING_INDICATORS.brandNames) {
      if (pageText.includes(brand) && !domain.includes(brand)) {
        score += 0.25;
        reasons.push(`References to ${brand} in unofficial domain`);
        break;
      }
    }
    
    return { score, reasons };
  } catch (error) {
    console.error(`Error analyzing page content: ${error.message}`);
    return { 
      score: 0.1,  // Slight increase in suspicion if we can't access the page
      reasons: ['Could not analyze page content'] 
    };
  }
}

/**
 * Main phishing detection function
 */
async function detectPhishing(urlToCheck) {
  try {
    console.log(`Analyzing URL: ${urlToCheck}`);
    
    // For demo purposes - check against known phishing domains
    const parsedUrl = new URL(urlToCheck);
    const domain = parsedUrl.hostname;
    
    if (KNOWN_PHISHING_DOMAINS.includes(domain)) {
      return {
        isPhishing: true,
        score: 0.95,
        confidence: "High",
        reasons: ['Known phishing domain']
      };
    }
    
    // Check if it's a known legitimate domain
    if (LEGITIMATE_DOMAINS.includes(domain)) {
      return {
        isPhishing: false,
        score: 0.05,
        confidence: "Low",
        reasons: ['Known legitimate domain']
      };
    }
    
    // Analyze URL structure
    const urlAnalysis = analyzeURLStructure(urlToCheck);
    
    // Analyze page content
    const contentAnalysis = await analyzePageContent(urlToCheck).catch(error => {
      console.error(`Content analysis error: ${error.message}`);
      return { score: 0.1, reasons: ['Error analyzing content'] };
    });
    
    // Calculate final score (weighted average)
    const finalScore = (urlAnalysis.score * 0.6) + (contentAnalysis.score * 0.4);
    const allReasons = [...urlAnalysis.reasons, ...contentAnalysis.reasons];
    
    // Determine confidence level
    let confidence = "Low";
    if (finalScore > 0.7) confidence = "High";
    else if (finalScore > 0.4) confidence = "Medium";
    
    return {
      isPhishing: finalScore > 0.5,
      score: parseFloat(finalScore.toFixed(2)),
      confidence,
      reasons: allReasons
    };
  } catch (error) {
    console.error(`Error in phishing detection: ${error.message}`);
    return {
      isPhishing: false,
      score: 0,
      confidence: "Error",
      reasons: [`Error: ${error.message}`]
    };
  }
}

module.exports = { detectPhishing };
