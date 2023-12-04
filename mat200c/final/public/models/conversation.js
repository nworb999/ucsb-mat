export class Conversation {
  constructor(character, targetName, relationship, topic) {
    this.character = character;
    this.targetName = targetName;
    this.relationship = relationship;
    this.topic = topic;
    this.outcome = null;
    this.summary = "";
  }

  start() {
    // use relationship here
    this.outcome = Math.ceil(Math.random() * 10); // Simulating a 10-sided die roll

    this.summary += `Character ${this.character.alignment.name} interacted with [${this.targetName}] and rolled an ${this.outcome}.\n`;

    return this.outcome;
  }
}
