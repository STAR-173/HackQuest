const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS for all routes
app.use(cors());

// Proxy middleware for Devfolio API
app.use('/api/devfolio', createProxyMiddleware({
  target: 'https://api.devfolio.co',
  changeOrigin: true,
  pathRewrite: {
    '^/api/devfolio': ''
  },
  headers: {
    'Origin': 'https://devfolio.co',
    'Referer': 'https://devfolio.co'
  },
  onProxyRes: (proxyRes) => {
    // Add CORS headers to the proxy response
    proxyRes.headers['Access-Control-Allow-Origin'] = '*';
    proxyRes.headers['Access-Control-Allow-Methods'] = 'GET, POST, OPTIONS';
    proxyRes.headers['Access-Control-Allow-Headers'] = 'Origin, X-Requested-With, Content-Type, Accept';
  }
}));

// Serve static files from the 'dist' directory
app.use(express.static(path.join(__dirname, 'dist')));

// For any other request, send the index.html file
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 