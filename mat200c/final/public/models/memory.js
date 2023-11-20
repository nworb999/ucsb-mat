import fs from "fs";
import path from "path";

class Memory {
  constructor(turn, character) {
    this.turn = turn;
    this.character = character;
    this.csvFilename = path.join(
      process.cwd(),
      "memory",
      `memory_character_${this.character.number}.csv`
    );
    if (!fs.existsSync(path.dirname(this.csvFilename))) {
      fs.mkdirSync(path.dirname(this.csvFilename));
    }
    this.csvHeader = "Turn,Character,Result,With\n";
    fs.writeFileSync(this.csvFilename, this.csvHeader, "utf8");
  }

  remember(conversation) {
    this.pastConversations.push(conversation);

    const csvRow = `${this.state},${this.character.number},${conversation.result},${conversation.with.number}\n`;

    fs.appendFileSync(this.csvFilename, csvRow, "utf8");
  }
}
