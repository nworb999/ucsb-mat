export class Conversation {
  constructor(character, targetName, relationship, content) {
    this.character = character;
    this.targetName = targetName;
    this.relationship = relationship;
    this.content = content;
    this.outcome = null;
  }

  start() {
    // rename to `converse`
    // use relationship here
    this.outcome = Math.ceil(Math.random() * 10); // Simulating a 10-sided die roll
    const topic = "the weather";
    const summary = `Character ${this.character.alignment.name} interacted with [${this.targetName}] while discussing ${topic} and rolled an ${this.outcome}.\n`;

    return this.outcome;
  }
}
