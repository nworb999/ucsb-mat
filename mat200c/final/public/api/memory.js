import express from "express";
import fs from "fs";
import path from "path";
import { Memory } from "../models/memory.js";

const router = express.Router();
const memoryDirectory = path.join(process.cwd(), "memory");

// Ensure the memory directory exists
if (!fs.existsSync(memoryDirectory)) {
  fs.mkdirSync(memoryDirectory);
}

router.post("/remember", (req, res) => {
  const { character, turn, conversation } = req.body;
  const memory = new Memory(character);
  memory.remember(turn, conversation);

  // Construct CSV filename
  const csvFilename = path.join(
    memoryDirectory,
    `memory_character_${character.name}.csv`
  );

  // Prepare data to write
  const csvHeader = "Turn,Character,Result,With\n";
  let csvContent = csvHeader;
  memory.pastConversations.forEach((convo) => {
    csvContent += `${convo.turn},${character.name},${convo.result},${convo.with}\n`;
  });

  // Write to CSV file
  fs.writeFileSync(csvFilename, csvContent, "utf8");

  res.send({ message: "Conversation remembered and written to CSV" });
});

export default router;
