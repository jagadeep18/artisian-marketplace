import mongoose from "mongoose";
import dns from "dns";

// Fix for querySrv ETIMEOUT: explicitly set DNS servers to Google and Cloudflare
// This resolves issues where local/ISP DNS fails to resolve MongoDB Atlas SRV records
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {
  console.warn("Warning: Could not set DNS servers, using system defaults.");
}

export const connectDB = async (retryCount = 5) => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000, // Timeout after 5 seconds
    });

    console.log(`\x1b[32m✔ MongoDB Connected: ${conn.connection.host}\x1b[0m`);
  } catch (error) {
    if (retryCount > 0) {
      console.log(`\x1b[33m⚠ MongoDB Connection failed, retrying in 2 seconds... (${retryCount} retries left)\x1b[0m`);
      await new Promise(resolve => setTimeout(resolve, 2000));
      return connectDB(retryCount - 1);
    }
    
    console.error("\x1b[31m✘ MongoDB Error:\x1b[0m", error.message);
    console.error("MongoDB URI (redacted):", process.env.MONGODB_URI?.replace(/:([^@]+)@/, ":****@"));
    process.exit(1);
  }
};