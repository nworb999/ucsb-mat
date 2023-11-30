import express from "express";
import fs from "fs";
import path from "path";

const router = express.Router();
const memoryDirectory = path.join(process.cwd(), "memory");

// Ensure the memory directory exists
if (!fs.existsSync(memoryDirectory)) {
  fs.mkdirSync(memoryDirectory);
}

function readMemoryCSV(characterName) {
  const csvFilename = path.join(
    memoryDirectory,
    `memory_character_${characterName}.csv`
  );

  if (!fs.existsSync(csvFilename)) {
    return []; // Return empty array if file doesn't exist
  }

  const csvContent = fs.readFileSync(csvFilename, "utf8");
  const lines = csvContent.split("\n").slice(1); // Skip header line
  return lines
    .filter((line) => line)
    .map((line) => {
      const [turn, result, withCharacter] = line.split(",");
      return { turn, result, with: withCharacter };
    });
}

router.get("/retrieve", (req, res) => {
  console.log(
    `${new Date().toISOString()} :: retrieving character memories : `,
    req.body.characters
  );
  const characters = req.body.characters;
  let allConversations = {};

  if (Array.isArray(characters)) {
    characters.forEach((characterName) => {
      const pastConversations = readMemoryCSV(characterName);
      allConversations[characterName] = pastConversations;
    });
  }

  res.json(allConversations);
});

router.post("/store", (req, res) => {
  const memories = req.body.memory;
  const turn = req.body.turn;

  console.log(
    `${new Date().toISOString()} :: storing character memories : `,
    turn
  );

  if (!memories || memories.length === 0) {
    return res.status(304).end();
  }
  memories.forEach((conversation) => {
    console.log("HEREEEE", conversation);
    const { character, otherCharacter, outcome } = conversation;

    const csvFilename = path.join(
      memoryDirectory,
      `memory_character_${character.alignment.name}.csv`
    );

    const updateCSV = (filename, character, otherCharacter, turn, result) => {
      let csvContent = fs.existsSync(filename)
        ? fs.readFileSync(filename, "utf8")
        : "Turn,Character,OtherCharacter,Outcome\n";
      csvContent += `${turn},${character},${otherCharacter},${result}\n`;
      fs.writeFileSync(filename, csvContent, "utf8");
    };

    updateCSV(
      csvFilename,
      character.alignment.name,
      otherCharacter.alignment.name,
      turn,
      outcome
    );
  });

  res.json({ message: "Memories stored successfully" });
});

export default router;
