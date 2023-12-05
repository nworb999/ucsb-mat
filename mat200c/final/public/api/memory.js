import express from "express";
import { retrieveMemories, storeMemories } from "./utils.js";

const router = express.Router();

router.get("/retrieve", (req, res) => {
  console.log(`${new Date().toISOString()} :: retrieving character memories`);

  const allConversations = retrieveMemories();
  console.log("keys", Object.keys(allConversations).slice(0, 5));
  res.json(allConversations);
});

router.post("/store", (req, res) => {
  const outcomes = req.body.outcomes;
  console.log("OUTCOMES BEING STORED", outcomes);
  console.log(`${new Date().toISOString()} :: storing character memories`);
  storeMemories(outcomes);

  res.json({ message: "Memories stored successfully" });
});

export default router;
