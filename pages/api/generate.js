import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function (req, res) {
  if (!configuration.apiKey) {
    res.status(500).json({
      error: {
        message: "OpenAI API key not configured, please follow instructions in README.md",
      }
    });
    return;
  }
   const text = req.body.text || "";
   if (text.trim().length === 0) {
     res.status(400).json({
       error: {
         message: "Please enter a valid text",
       },
     });
     return;
   }
  if (text.trim().length <= 60) {
     res.status(400).json({
       error: {
         message: "Please enter more text",
       },
     });
     return;
  }
  
  try {
    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: generateResponse(text),
      temperature: 0.1,
      max_tokens: 256,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    });
    res.status(200).json({ result: response.data.choices[0].text });
  } catch(error) {
    // Consider adjusting the error handling logic for your use case
    if (error.response) {
      console.error(error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
      res.status(500).json({
        error: {
          message: 'An error occurred during your request.',
        }
      });
    }
  }
}

const generateResponse = (text) => {
  return `this is a chat between a student already studying in UCLA university and a student who wants to join this university, summarise this chat in very detail:\n\n${text}`;
}
