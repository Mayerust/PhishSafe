
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

// Create functions for creating base64 encoded PNG icons - these will serve as fallbacks
function createPngIconBase64(size = 48, type = 'shield') {
  // Simple canvas-based icon creation
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  
  // Set background
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, size, size);
  
  // Draw icon based on type
  switch(type) {
    case 'shield':
      ctx.fillStyle = '#3a57e8';
      ctx.beginPath();
      ctx.moveTo(size/2, size*0.1);
      ctx.lineTo(size*0.2, size*0.25);
      ctx.lineTo(size*0.2, size*0.6);
      ctx.bezierCurveTo(size*0.2, size*0.8, size/2, size*0.9, size/2, size*0.9);
      ctx.bezierCurveTo(size/2, size*0.9, size*0.8, size*0.8, size*0.8, size*0.6);
      ctx.lineTo(size*0.8, size*0.25);
      ctx.closePath();
      ctx.fill();
      break;
    case 'warning':
      ctx.fillStyle = '#f59e0b';
      ctx.beginPath();
      ctx.moveTo(size/2, size*0.2);
      ctx.lineTo(size*0.1, size*0.8);
      ctx.lineTo(size*0.9, size*0.8);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(size/2, size*0.65, size*0.05, 0, Math.PI*2);
      ctx.fill();
      ctx.fillRect(size*0.45, size*0.35, size*0.1, size*0.2);
      break;
    case 'check':
      ctx.fillStyle = '#22c55e';
      ctx.beginPath();
      ctx.arc(size/2, size/2, size*0.4, 0, Math.PI*2);
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = size*0.08;
      ctx.beginPath();
      ctx.moveTo(size*0.3, size*0.5);
      ctx.lineTo(size*0.45, size*0.65);
      ctx.lineTo(size*0.7, size*0.35);
      ctx.stroke();
      break;
  }
  
  try {
    return canvas.toDataURL('image/png');
  } catch (e) {
    console.error('Error creating icon:', e);
    // Return a simple colored square as absolute fallback
    return `data:image/svg+xml;base64,${btoa(`<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}"><rect width="${size}" height="${size}" fill="${type === 'shield' ? '#3a57e8' : type === 'warning' ? '#f59e0b' : '#22c55e'}"/></svg>`)}`;
  }
}

// Function to generate all extension icons at various sizes
function generateExtensionIcons() {
  try {
    // Generate shield icons for the extension
    window.PhishSafeIcons = window.PhishSafeIcons || {};
    
    // Generate all required sizes
    window.PhishSafeIcons.icon16 = createPngIconBase64(16, 'shield');
    window.PhishSafeIcons.icon48 = createPngIconBase64(48, 'shield');
    window.PhishSafeIcons.icon128 = createPngIconBase64(128, 'shield');
    
    console.log('Successfully generated extension icons');
  } catch (e) {
    console.error('Error generating extension icons:', e);
  }
}

// Export the icon functions
window.PhishSafeIcons = {
  createShieldIcon,
  createWarningIcon,
  createCheckIcon,
  createPngIconBase64,
  generateExtensionIcons,
  // Include direct icon data
  icon16: createPngIconBase64(16, 'shield'),
  icon48: createPngIconBase64(48, 'shield'),
  icon128: createPngIconBase64(128, 'shield')
};

// Replace icon URLs with data URLs
document.addEventListener('DOMContentLoaded', function() {
  // Create dynamic icon elements in the extension UI
  try {
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
    
    // Generate all extension icons
    generateExtensionIcons();
  } catch (e) {
    console.error('Error processing icon elements:', e);
  }
});
