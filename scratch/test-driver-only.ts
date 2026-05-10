import "dotenv/config";
import { Pool, neonConfig } from "@neondatabase/serverless";
import ws from "ws";

neonConfig.webSocketConstructor = ws;

async function testDriver() {
  console.log("Testing Neon Driver directly...");
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  
  try {
    const res = await pool.query("SELECT NOW()");
    console.log("Success! Server time:", res.rows[0]);
  } catch (err) {
    console.error("Direct Driver Error:", err);
  } finally {
    await pool.end();
  }
}

testDriver();
