import { ChatService } from "./chatService.js";

export class HuggingFaceChatService extends ChatService {
  constructor(huggingFaceInstance) {
    super();
    this.huggingface = huggingFaceInstance;
  }

  async sendPrompt(prompt) {
    const response = await this.huggingface.conversational({
      model: "microsoft/DialoGPT-large",
      inputs: {
        // past_user_inputs: ["Which movie is the best ?"],
        // generated_responses: ["It is Die Hard for sure."],
        text: "Which movie is the best ?",
      },
    });
    const result = response["generated_text"];
    return result;
  }
}
