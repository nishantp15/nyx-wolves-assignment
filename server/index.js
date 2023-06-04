// server.js
const express = require('express');
const cors = require('cors');
const connectDB = require('./Database/db');
const recordsRouter = require('./routes/records');

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));


connectDB().then(()=>{
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
});

// Routes
app.use('/api/records', recordsRouter);



