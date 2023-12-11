import express from "express";
import { ChatService } from "../backend-services/chatService.js";
import { runConversationPrompts as generateConversationPrompts } from "../utils/chat.js";

const router = express.Router();

let chatService = new ChatService();

router.post("/prompt", async (req, res) => {
  try {
    const gameState = req.body.gameState;
    const { leftTablePrompt, rightTablePrompt } =
      generateConversationPrompts(gameState);
    // do this in for loop for both tables
    const chatResponse = await chatService.sendPrompt(leftTablePrompt);
    console.log(chatResponse);
    const response = { message: chatResponse };
    res.json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export function setChatService(service) {
  chatService = service;
}

export { router as default };
