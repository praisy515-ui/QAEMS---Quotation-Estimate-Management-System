const app = require('./app');
const dotenv = require('dotenv');

dotenv.config();

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`===============================================`);
  console.log(` QAEMS Backend Server Running `);
  console.log(` Port: ${PORT} `);
  console.log(` Environment: ${process.env.NODE_ENV || 'development'} `);
  console.log(` Documentation: http://localhost:${PORT}/api-docs `);
  console.log(`===============================================`);
});

// Graceful shutdown handling
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received. Closing server...');
  server.close(() => {
    console.log('Server closed. Process terminated.');
  });
});
