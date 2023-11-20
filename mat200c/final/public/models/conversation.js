class Conversation {
  constructor(characters, topic) {
    this.characters = characters;
    this.topic = topic;
    this.outcome = null;
    this.summary = "";
  }

  start() {
    // Simulate interactions and generate outcomes
    this.characters.forEach((character, index) => {
      const otherCharacter =
        this.characters[(index + 1) % this.characters.length];
      const interactionResult = Math.ceil(Math.random() * 10); // Simulating a 10-sided die roll

      // Store the outcome of the interaction for each character
      character.remember({ result: interactionResult, with: otherCharacter });

      // Update the conversation summary
      this.summary += `Character ${character.number} interacted with Character ${otherCharacter.number} and rolled a ${interactionResult}.\n`;
    });

    // Optionally, you can set a final outcome for the conversation
    this.outcome = "Some final outcome based on the interactions";
  }
}
