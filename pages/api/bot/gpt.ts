import OpenAI from "openai";
const openai = new OpenAI({
  apiKey: process.env.GPT_API_KEY,
});

async function correctGrammar(message: string) {
	const request = `Check English grammar: ${message}`;
	return sendMessage(request);
}

function sendMessage(request: string) {
 return openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'user',
        content: request,
      },
    ],
  });

}

export {
	correctGrammar,
}
