import './dotenv-loader';
import app from './app';
import http from 'http';
import * as dbUtils from './utils/database';

const PORT = Number(process.env.PORT) || 8080; // Fallback to 8080 if port is undefined

(async () => {
  try {
    // Test initial connection
    await dbUtils.connectToSql();

    const httpServer = http.createServer(app);

    httpServer.listen(PORT, '0.0.0.0', async () => {
      console.log(`Server is running on port ${PORT} at ${new Date()}`);
    });
  } catch (error) {
    console.log(error);
  }
})();
