export class Memory {
  constructor(character) {
    this.character = character.name;
    this.pastConversations = this.remember(character)
      ? this.remember(character)
      : [];
  }

  // i think this is totally unused now lmao delete

  remember(character) {}

  store(turn, conversation) {
    this.pastConversations.push({
      turn: turn,
      result: conversation.result,
      summary: conversation.summary,
      with: conversation.with.name,
    });
  }
}
