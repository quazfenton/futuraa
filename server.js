import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Set NODE_ENV in the environment
const isProduction = process.env.NODE_ENV === 'production' || !process.env.VITE_DEV_SERVER_URL;

async function createApp() {
  const app = express();

  // Add Content Security Policy headers
  app.use((req, res, next) => {
    res.setHeader('Content-Security-Policy', 
      "default-src 'self'; " +
      "frame-src 'self' https://chat.quazfenton.xyz https://*.github.com https://*.huggingface.co https://quazfenton.github.io; " +
      "script-src 'self' 'unsafe-inline' https://*.googleapis.com; " +
      "style-src 'self' 'unsafe-inline' https://*.googleapis.com; " +
      "img-src 'self' data: https:; " +
      "font-src 'self' https:; " +
      "connect-src 'self' https://api.github.com https://huggingface.co; " +
      "frame-ancestors 'none';" // Prevent clickjacking
    );
    next();
  });

  if (!isProduction) {
    // In development: use Vite's middleware
    // Use dynamic import to avoid module resolution in production
    try {
      const { createServer } = await import('vite');
      const vite = await createServer({
        server: { middlewareMode: true },
      });
      app.use(vite.middlewares);
    } catch (error) {
      console.error('Error importing Vite (this is expected in production):', error.message);
      // If in development but Vite can't be imported, just serve static files for now
      app.use(express.static(path.resolve(__dirname, 'dist')));
      app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
      });
    }
  } else {
    // In production: serve the built assets
    app.use(express.static(path.resolve(__dirname, 'dist')));
    
    // Handle client-side routing
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  const port = parseInt(process.env.PORT || '8080');
  
  // Start the server and return it for error handling
  const server = app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
  
  // Handle potential server errors
  server.on('error', (err) => {
    console.error('Server error:', err);
    process.exit(1);
  });
  
  return server;
}

// Execute the function and handle potential errors
createApp().catch((err) => {
  console.error('Failed to start application:', err);
  process.exit(1);
});