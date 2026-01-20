
import { GoogleGenAI } from "@google/genai";
import { Chapter } from "../types";

export const generateSmmLesson = async (
  chapter: Chapter,
  systemPrompt: string,
  modelName: string
): Promise<string> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) throw new Error("API Key not found in environment variables.");

  const ai = new GoogleGenAI({ apiKey });
  
  const promptText = `
Module: ${chapter.moduleNumber}
Lesson: ${chapter.lessonNumber}
Chapter Content:
---
${chapter.content}
---
IMPORTANT: Generate a comprehensive lesson (1500-2500 words). 
Language: Azerbaijani. 
Follow all system instructions strictly. Focus on turning the student into a professional hireable SMM specialist for Baku businesses.
  `;

  const response = await ai.models.generateContent({
    model: modelName,
    contents: [{ role: 'user', parts: [{ text: promptText }] }],
    config: {
      systemInstruction: systemPrompt,
      temperature: 0.9, // Вернул высокую креативность для того самого стиля
      maxOutputTokens: 16384,
      thinkingConfig: { thinkingBudget: 4000 } // Оставил только чтобы не было ошибки 400
    },
  });

  const lesson = response.text;
  if (!lesson) throw new Error("Model returned an empty response.");
  
  return lesson;
};
