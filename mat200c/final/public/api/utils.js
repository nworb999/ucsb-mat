import path from "path";
import fs from "fs";

export const memoryDirectory = path.join(process.cwd(), "memory");

if (!fs.existsSync(memoryDirectory)) {
  fs.mkdirSync(memoryDirectory);
}

function readMemoryCSV(characterName) {
  const csvFilename = path.join(
    memoryDirectory,
    `memory_character_${characterName}.csv`
  );

  if (!fs.existsSync(csvFilename)) {
    return [];
  }

  const csvContent = fs.readFileSync(csvFilename, "utf8");
  const lines = csvContent.split("\n").slice(1);
  return lines
    .filter((line) => line)
    .map((line) => {
      const [turn, result, withCharacter] = line.split(",");
      return { turn, result, with: withCharacter };
    });
}

const updateCSV = (filename, character, otherCharacter, turn, result) => {
  let csvContent =
    fs.existsSync(filename) && turn !== 1
      ? fs.readFileSync(filename, "utf8")
      : "Turn,Character,OtherCharacter,Outcome\n";
  csvContent += `${turn},${character},${otherCharacter},${result}\n`;
  fs.writeFileSync(filename, csvContent, "utf8");
};

export function retrieveMemories(characters) {
  let allConversations = {};

  if (Array.isArray(characters)) {
    characters.forEach((characterName) => {
      const pastConversations = readMemoryCSV(characterName);
      allConversations[characterName] = pastConversations;
    });
  }

  return allConversations;
}

export function storeMemories(memories) {
  if (!memories || memories.length === 0) {
    return res.status(304).end();
  }
  memories.forEach((conversation) => {
    const { turn, character, otherCharacter, outcome } = conversation;

    const csvFilename = path.join(
      memoryDirectory,
      `memory_character_${character.alignment.name.replace(" ", "_")}.csv`
    );

    updateCSV(
      csvFilename,
      character.alignment.name,
      otherCharacter.alignment.name,
      turn,
      outcome
    );
  });
}
