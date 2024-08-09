import { MongoClient } from "mongodb";

const client = new MongoClient(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

let db;

export async function connectToDatabase() {
  if (db) return { db };

  await client.connect();
  db = client.db("yourDatabaseName");
  return { db };
}