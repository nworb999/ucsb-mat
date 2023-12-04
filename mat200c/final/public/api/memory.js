import express from "express";
import { retrieveMemories, storeMemories } from "./utils.js";

const router = express.Router();

router.get("/retrieve", (req, res) => {
  console.log(`${new Date().toISOString()} :: retrieving character memories`);

  const allConversations = retrieveMemories();
  console.log(allConversations);
  res.json(allConversations);
});

router.post("/store", (req, res) => {
  const memory = req.body.memory;
  console.log(`${new Date().toISOString()} :: storing character memories`);
  if (!memory || memory.length === 0) {
    return res.status(304).end();
  }
  storeMemories(memory);

  res.json({ message: "Memories stored successfully" });
});

export default router;
