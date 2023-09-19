import "dotenv/config.js";
import express from "express";
import { PostgresClient } from "./src/db/postgres/client.js";

const app = express();

app.get("/", async (req, res) => {
  const results = await PostgresClient.query("SELECT * from users;");

  res.send(results);
});

app.listen(3000, () => console.log("Listening on port 3000!!!"));
