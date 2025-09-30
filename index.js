const express = require('express');
const app = express();
const port = 3000;

// Middleware to parse JSON requests
app.use(express.json());

// Define the /logs endpoint
app.get('/logs', (req, res) => {
  // Static content to return
  const logs = {
    timestamp: new Date().toISOString(),
    entries: [
      { level: 'info', message: 'Application started successfully', timestamp: '2025-09-30T10:00:00Z' },
      { level: 'info', message: 'User authentication successful', timestamp: '2025-09-30T10:05:23Z' },
      { level: 'warning', message: 'High memory usage detected', timestamp: '2025-09-30T10:15:45Z' },
      { level: 'error', message: 'Database connection failed', timestamp: '2025-09-30T10:17:12Z' },
      { level: 'info', message: 'Database connection restored', timestamp: '2025-09-30T10:18:30Z' }
    ],
    count: 5,
    status: 'success'
  };
  
  res.json(logs);
});

// Default route
app.get('/', (req, res) => {
  res.send('Welcome to the API! Try accessing the /logs endpoint.');
});

// Start the server
app.listen(port, () => {
  console.log(`API server running at http://localhost:${port}`);
});
