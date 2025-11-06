// Environment configuration
export const config = {
  apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:8080',
  environment: import.meta.env.NODE_ENV || 'development',
  version: import.meta.env.VITE_APP_VERSION || 'development',
  debug: import.meta.env.VITE_DEBUG === 'true',
  
  // Feature flags
  features: {
    analytics: import.meta.env.VITE_FEATURE_ANALYTICS !== 'false',
    collaboration: import.meta.env.VITE_FEATURE_COLLABORATION !== 'false',
    externalIframes: import.meta.env.VITE_FEATURE_EXTERNAL_IFRAMES !== 'false',
  },
  
  // External services
  services: {
    chatDomain: import.meta.env.VITE_CHAT_DOMAIN || 'chat.quazfenton.xyz',
    githubDomain: import.meta.env.VITE_GITHUB_DOMAIN || 'github.com',
    huggingfaceDomain: import.meta.env.VITE_HUGGINGFACE_DOMAIN || 'huggingface.co',
  },
  
  // Performance settings
  performance: {
    maxConcurrentIframes: parseInt(import.meta.env.VITE_MAX_IFRAMES || '3'),
    animationFps: parseInt(import.meta.env.VITE_ANIMATION_FPS || '60'),
    memoryLimit: parseInt(import.meta.env.VITE_MEMORY_LIMIT || '256'), // MB
  },
  
  // Security settings
  security: {
    enableCSP: import.meta.env.VITE_ENABLE_CSP !== 'false',
    enablePostMessageValidation: import.meta.env.VITE_VALIDATE_POSTMESSAGE !== 'false',
    maxIframeLoadTime: parseInt(import.meta.env.VITE_IFRAME_TIMEOUT || '10000'), // ms
  }
};

// Validation
if (config.environment === 'production' && config.debug) {
  console.warn('Warning: Debug mode enabled in production');
}

export default config;