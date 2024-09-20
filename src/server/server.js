
// server.js
const express = require('express');
const path = require('path');
const fs = require('fs');
const routes = require('./routes');
const app = express();

// Use JSON middleware if needed
app.use(express.json());

// Serve static files
app.use('/audio', express.static(path.join(__dirname, 'audio')));

// Use routes
app.use('/api', routes);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

