import app from './app';

const PORT = process.env.PORT || 4000;

const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

process.on('SIGINT', () => {
  console.log('SIGINT received: shutting down server...');
  server.close(() => {
    console.log('Server has been gracefully terminated');
    process.exit(0);
  });
});

process.on('SIGTERM', () => {
  console.log('SIGTERM received: shutting down server...');
  server.close(() => {
    console.log('Server has been gracefully terminated');
    process.exit(0);
  });
});
