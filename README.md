# Devfolio Hackathon Finder

A modern web application that fetches and displays hackathons from the Devfolio API, with filtering capabilities.

## Features

- Browse upcoming hackathons
- Filter by search term, location type (online/in-person), and date range
- Toggle between list and map views
- Load more hackathons with pagination
- Responsive design for mobile and desktop

## Getting Started

1. Clone the repository
2. Run `npm install`
3. Run `npm run dev` for development
4. Run `npm run build` to create a production build
5. Run `npm start` to start the production server

## CORS Issue & Solutions

This application addresses the Cross-Origin Resource Sharing (CORS) issue when fetching data from the Devfolio API with multiple approaches:

### 1. Vite Development Proxy

In development mode, the application uses Vite's proxy configuration to route API requests through the development server, which adds the necessary CORS headers.

```javascript
// vite.config.ts
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api/devfolio': {
        target: 'https://api.devfolio.co',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/devfolio/, ''),
        headers: {
          'Origin': 'https://devfolio.co',
          'Referer': 'https://devfolio.co'
        }
      }
    }
  }
})
```

### 2. Public CORS Proxy

As a fallback, the application can use a public CORS proxy service like CORS Anywhere:

```javascript
const CORS_PROXY = 'https://cors-anywhere.herokuapp.com/';
const proxyUrl = `${CORS_PROXY}${DEVFOLIO_API_URL}`;
```

### 3. Express Server Proxy for Production

For production, a simple Express server is included that serves the built application and acts as a proxy for the Devfolio API:

```javascript
app.use('/api/devfolio', createProxyMiddleware({
  target: 'https://api.devfolio.co',
  changeOrigin: true,
  pathRewrite: {
    '^/api/devfolio': ''
  },
  // ... headers and CORS handling
}));
```

### 4. Mock Data Fallback

If all proxy methods fail, the application falls back to using mock data to demonstrate functionality:

```javascript
// Fallback: Mock data
console.log('Using mock hackathon data as fallback');
return createMockHackathons();
```

## Technologies Used

- React
- TypeScript
- Tailwind CSS
- React Router
- React Leaflet (for map view)
- Vite
- Express (for production server)
