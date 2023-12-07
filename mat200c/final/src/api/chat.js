import express from "express";
import { ChatService } from "../backend-services/chatService.js";

const router = express.Router();

let chatService = new ChatService();

router.post("/prompt", async (req, res) => {
  try {
    const prompt = req.body.prompt;
    const chatResponse = await chatService.sendPrompt(prompt);
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
