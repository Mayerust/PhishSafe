
// This file provides functions to create SVG icons as data URLs
// This helps solve the issue with accessing icon files directly

// Create shield icon with customizable size and color
function createShieldIcon(size = 48, color = '#3a57e8') {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
  </svg>`;
  
  return `data:image/svg+xml;base64,${btoa(svg)}`;
}

// Create warning icon with customizable size and color
function createWarningIcon(size = 48, color = '#f59e0b') {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path>
    <line x1="12" y1="9" x2="12" y2="13"></line>
    <line x1="12" y1="17" x2="12.01" y2="17"></line>
  </svg>`;
  
  return `data:image/svg+xml;base64,${btoa(svg)}`;
}

// Create check icon with customizable size and color
function createCheckIcon(size = 48, color = '#22c55e') {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
    <polyline points="22 4 12 14.01 9 11.01"></polyline>
  </svg>`;
  
  return `data:image/svg+xml;base64,${btoa(svg)}`;
}

// Export the icon functions
window.PhishSafeIcons = {
  createShieldIcon,
  createWarningIcon,
  createCheckIcon
};

// Replace icon URLs with data URLs
document.addEventListener('DOMContentLoaded', function() {
  // Create dynamic icon elements in the extension UI
  const iconElements = document.querySelectorAll('[data-phishsafe-icon]');
  
  iconElements.forEach(element => {
    const iconType = element.getAttribute('data-phishsafe-icon');
    const size = element.getAttribute('data-size') || 48;
    
    let iconUrl;
    switch(iconType) {
      case 'shield':
        iconUrl = createShieldIcon(size);
        break;
      case 'warning':
        iconUrl = createWarningIcon(size);
        break;
      case 'check':
        iconUrl = createCheckIcon(size);
        break;
      default:
        iconUrl = createShieldIcon(size);
    }
    
    if (element.tagName === 'IMG') {
      element.src = iconUrl;
    } else {
      element.style.backgroundImage = `url(${iconUrl})`;
    }
  });
});
