require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectToMongo = require('./db');

// Connect to MongoDB before starting the server
connectToMongo().then(() => {
  const app = express();
  const port = 5000;

  app.use(cors());
  app.use(express.json());

  // Available Routes
  app.use('/api/auth', require('./routes/auth'));
  app.use('/api/notes', require('./routes/notes'));

  app.listen(port, () => {
    console.log(`iNotebook backend listening at http://localhost:${port}`);
  });
}).catch((error) => {
  console.error('Error connecting to MongoDB:', error);
});