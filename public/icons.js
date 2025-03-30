
// This file provides functions to create SVG icons as data URLs
// This helps solve the issue with accessing icon files directly

// Create shield icon with customizable size and color
function createShieldIcon(size = 48, color = '#3a57e8') {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
  </svg>`;
  
  try {
    return `data:image/svg+xml;base64,${btoa(svg)}`;
  } catch (e) {
    console.error('Error creating shield icon:', e);
    return createFallbackIcon(size, 'shield');
  }
}

// Create warning icon with customizable size and color
function createWarningIcon(size = 48, color = '#f59e0b') {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path>
    <line x1="12" y1="9" x2="12" y2="13"></line>
    <line x1="12" y1="17" x2="12.01" y2="17"></line>
  </svg>`;
  
  try {
    return `data:image/svg+xml;base64,${btoa(svg)}`;
  } catch (e) {
    console.error('Error creating warning icon:', e);
    return createFallbackIcon(size, 'warning');
  }
}

// Create check icon with customizable size and color
function createCheckIcon(size = 48, color = '#22c55e') {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
    <polyline points="22 4 12 14.01 9 11.01"></polyline>
  </svg>`;
  
  try {
    return `data:image/svg+xml;base64,${btoa(svg)}`;
  } catch (e) {
    console.error('Error creating check icon:', e);
    return createFallbackIcon(size, 'check');
  }
}

// Create a fallback icon when SVG generation fails
function createFallbackIcon(size = 48, type = 'shield') {
  // Create a canvas element to generate a PNG icon
  try {
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    
    if (!ctx) {
      throw new Error('Could not get canvas context');
    }
    
    // Fill with default colors based on icon type
    ctx.fillStyle = type === 'shield' ? '#3a57e8' : 
                   type === 'warning' ? '#f59e0b' : 
                   type === 'check' ? '#22c55e' : '#808080';
                   
    ctx.fillRect(0, 0, size, size);
    
    // Add a simple shape
    ctx.beginPath();
    if (type === 'shield') {
      // Shield shape
      ctx.moveTo(size/2, size*0.1);
      ctx.lineTo(size*0.2, size*0.25);
      ctx.lineTo(size*0.2, size*0.6);
      ctx.bezierCurveTo(size*0.2, size*0.8, size/2, size*0.9, size/2, size*0.9);
      ctx.bezierCurveTo(size/2, size*0.9, size*0.8, size*0.8, size*0.8, size*0.6);
      ctx.lineTo(size*0.8, size*0.25);
      ctx.closePath();
      ctx.fillStyle = '#ffffff';
      ctx.fill();
    } else if (type === 'warning') {
      // Warning triangle
      ctx.moveTo(size/2, size*0.2);
      ctx.lineTo(size*0.8, size*0.8);
      ctx.lineTo(size*0.2, size*0.8);
      ctx.closePath();
      ctx.fillStyle = '#ffffff';
      ctx.fill();
    } else if (type === 'check') {
      // Checkmark circle
      ctx.arc(size/2, size/2, size*0.4, 0, Math.PI*2);
      ctx.fillStyle = '#ffffff';
      ctx.fill();
    }
    
    return canvas.toDataURL();
  } catch (e) {
    console.error('Error creating fallback icon:', e);
    // Return a simple colored data URL
    return `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}"><rect width="${size}" height="${size}" fill="${
      type === 'shield' ? '%233a57e8' : 
      type === 'warning' ? '%23f59e0b' : 
      type === 'check' ? '%2322c55e' : '%23808080'
    }"/></svg>`;
  }
}

// Function to generate all extension icons at various sizes
function generateExtensionIcons() {
  try {
    console.log('Generating extension icons');
    
    // Create global PhishSafeIcons object if it doesn't exist
    window.PhishSafeIcons = window.PhishSafeIcons || {};
    
    // Generate all required icon sizes
    window.PhishSafeIcons.icon16 = createShieldIcon(16);
    window.PhishSafeIcons.icon48 = createShieldIcon(48);
    window.PhishSafeIcons.icon128 = createShieldIcon(128);
    
    console.log('Successfully generated extension icons');
    return true;
  } catch (e) {
    console.error('Error generating extension icons:', e);
    return false;
  }
}

// Export icon functions to global namespace
window.PhishSafeIcons = {
  createShieldIcon,
  createWarningIcon,
  createCheckIcon,
  createFallbackIcon,
  generateExtensionIcons
};

// Initialize icons when the script loads
generateExtensionIcons();

// Add event listener to initialize icons when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  try {
    console.log('DOM loaded, initializing icons');
    
    // Find all elements with data-phishsafe-icon attribute
    const iconElements = document.querySelectorAll('[data-phishsafe-icon]');
    
    iconElements.forEach(element => {
      const iconType = element.getAttribute('data-phishsafe-icon');
      const size = parseInt(element.getAttribute('data-size') || '48', 10);
      
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
      
      // Set the icon as src for img elements or background for other elements
      if (element.tagName === 'IMG') {
        element.src = iconUrl;
      } else {
        element.style.backgroundImage = `url(${iconUrl})`;
        element.style.backgroundSize = 'contain';
        element.style.backgroundPosition = 'center';
        element.style.backgroundRepeat = 'no-repeat';
      }
    });
    
    console.log('PhishSafe icons initialized successfully');
  } catch (e) {
    console.error('Error initializing PhishSafe icons:', e);
  }
});

// Log successful script load
console.log('PhishSafe icons.js loaded');
