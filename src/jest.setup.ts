import mongoose from "mongoose";
import "dotenv/config";

const MONGO_URI = process.env.MONGO_URI || "";

const connect = async () => {
  await mongoose.connect(MONGO_URI || "");
};

const closeDatabase = async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
};

const clearDatabase = async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany({});
  }
};

beforeEach(async () => await connect());
afterEach(async () => await clearDatabase());
afterAll(async () => await closeDatabase());
