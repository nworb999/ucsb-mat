import express from "express";

const router = express.Router();

let openai;

router.post("/prompt", async (req, res) => {
  try {
    const prompt = req.body.prompt;
    const gptResponse = await openai.chat.completions.create({
      messages: [{ role: "system", content: "You are a helpful assistant." }],
      model: "davinci",
    });
    console.log(gptResponse);
    const response = { message: "Received: " + "blue maybe" };
    res.json(response);
    // res.json({ response: gptResponse.data.choices[0].text });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export function setOpenAI(instance) {
  openai = instance;
}

export { router as default };
