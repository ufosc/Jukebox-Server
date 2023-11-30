import "dotenv/config";

const config =  {
  BASE_ROUTE: "/api",
  HOST: process.env.HOST,
  PORT: process.env.PORT,
  MONGO_URI: process.env.MONGO_URI
}

export default config;