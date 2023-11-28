export class Memory {
  constructor(character) {
    this.character = character;
    this.pastConversations = [];
  }

  remember(turn, conversation) {
    const conversationRecord = {
      turn: turn,
      result: conversation.result,
      with: conversation.with.name,
    };
    this.pastConversations.push(conversationRecord);
  }
}
