import app from "./src/app";
import { connectDB, disconnectDB } from "./src/config/database";
import enVars from "./src/config/environment";

const startServer = async () => {
  try {
    // Connect to database
    await connectDB();

    // Start server
    app.listen(enVars.port, () => {
      console.log(`Server running on port ${enVars.port}`);
      // console.log(`API Documentation: `);
    });

    // Graceful shutdown on signal interrupt
    process.on("SIGINT", async () => {
      console.log("Shutting down gracefully...");
      await disconnectDB();
      process.exit(0);
    });

    // Graceful shutdown on signal terminate
    process.on("SIGTERM", async () => {
      console.log("Shutting down gracefully...");
      await disconnectDB();
      process.exit(0);
    });
  } catch (error: any) {
    console.log("Failed to start server:", error.message);
    process.exit(1);
  }
};

startServer();
