import http from 'http';
import app from './app';
import { initSocket } from './socket/socket';
import { connectToDatabase } from './db';

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);

initSocket(server);


connectToDatabase().then(() => {
    console.log("Database connected successfully");
    server.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    })
})
    .catch((error) => {
        console.error("Failed to connect to database:", error);
        process.exit(1);
    })