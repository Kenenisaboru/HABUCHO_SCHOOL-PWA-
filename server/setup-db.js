import pg from "pg";
import readline from "readline";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

console.log("---------------------------------------------------");
console.log("🐘 PostgreSQL Database Automatic Setup");
console.log("---------------------------------------------------");

rl.question("Please enter your PostgreSQL password (for the 'postgres' user): ", async (password) => {
  if (!password) {
    console.error("❌ Password cannot be empty.");
    rl.close();
    process.exit(1);
  }

  const { Client } = pg;
  
  // 1. Connect to default 'postgres' database to create the new one
  const client = new Client({
    user: "postgres",
    password: password,
    host: "localhost",
    port: 5432,
    database: "postgres", // default db
  });

  try {
    console.log("\nConnecting to PostgreSQL...");
    await client.connect();
    
    // 2. Check if habucho_school already exists
    const checkRes = await client.query("SELECT datname FROM pg_catalog.pg_database WHERE datname = 'habucho_school'");
    if (checkRes.rowCount > 0) {
      console.log("✅ Database 'habucho_school' already exists.");
    } else {
      // 3. Create the database
      console.log("Creating database 'habucho_school'...");
      await client.query("CREATE DATABASE habucho_school");
      console.log("✅ Database created successfully!");
    }

    // 4. Update the .env file
    const envPath = path.join(__dirname, ".env");
    if (fs.existsSync(envPath)) {
      let envContent = fs.readFileSync(envPath, "utf8");
      
      // Use a regex to replace the password in the DATABASE_URL, even if it has special characters
      // old: DATABASE_URL=postgresql://postgres:password@localhost:5432/habucho_school
      const newUrl = `DATABASE_URL=postgresql://postgres:${encodeURIComponent(password)}@localhost:5432/habucho_school`;
      
      if (envContent.includes("DATABASE_URL=")) {
        envContent = envContent.replace(/DATABASE_URL=.*/g, newUrl);
      } else {
        envContent += `\n${newUrl}\n`;
      }
      
      fs.writeFileSync(envPath, envContent);
      console.log("✅ Updated server/.env file with your password.");
    } else {
      console.log("⚠️ Could not find .env file to update.");
    }

    console.log("\n🎉 ALL DONE! You can now run 'npm run dev' in the server folder.");
  } catch (err) {
    if (err.code === "28P01") {
      console.error("\n❌ ERROR: Incorrect password for user 'postgres'. Please try again.");
    } else if (err.code === "ECONNREFUSED") {
      console.error("\n❌ ERROR: Could not connect to PostgreSQL. Is the PostgreSQL service running on your computer?");
    } else {
      console.error("\n❌ ERROR:", err.message);
    }
  } finally {
    await client.end();
    rl.close();
    process.exit(0);
  }
});
