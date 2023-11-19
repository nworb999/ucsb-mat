class Memory {
  constructor(character) {
    this.character = character;
    this.pastConversations = [];
  }

  remember(conversation) {
    this.pastConversations.push(conversation);
  }
}
