import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);

const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export async function correctGrammar(message: string) {
  const prompt = `Correct English grammar: ${message}`;

  const result = await model.generateContent(prompt);
  return result.response.text();
}

export async function translateToVie(message: string) {
    const prompt = `Dịch sang tiếng Việt: ${message}`;
  
    const result = await model.generateContent(prompt);
    return result.response.text();
}

export async function translateToEng(message: string) {
	const prompt = `Translate to English: ${message}`;

	const result = await model.generateContent(prompt);
	return result.response.text();
}