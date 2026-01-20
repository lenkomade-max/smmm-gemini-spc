
import { Chapter } from "../types";

interface WordCountConfig {
  enabled: boolean;
  min: number;
  max: number;
}

export const generateSmmLesson = async (
  chapter: Chapter,
  systemPrompt: string,
  modelName: string,
  wordCount: WordCountConfig
): Promise<string> => {
  const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY;
  if (!apiKey) throw new Error("OpenRouter API Key not found in environment variables.");

  // Build context section if previous lesson context exists
  let contextSection = '';
  if (chapter.previousContext) {
    contextSection = `
Previous Lesson Context:
Title: ${chapter.previousContext.title}
Summary: ${chapter.previousContext.summary}
---

`;
  }

  // Build word count instruction if enabled
  const wordCountInstruction = wordCount.enabled
    ? `Generate a comprehensive lesson (${wordCount.min}-${wordCount.max} words).`
    : '';

  const promptText = `
${contextSection}Module: ${chapter.moduleNumber}
Current Lesson: ${chapter.lessonNumber} - ${chapter.title}
Content:
---
${chapter.content}
---
${wordCountInstruction}
Language: Azerbaijani.
Follow all system instructions strictly. Focus on turning the student into a professional hireable SMM specialist for Baku businesses.
  `;

  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "HTTP-Referer": window.location.origin,
      "X-Title": "SMM Content Factory"
    },
    body: JSON.stringify({
      model: modelName,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: promptText }
      ],
      temperature: 0.9,
      max_tokens: 16384,
      // OpenRouter equivalent of thinkingConfig for Gemini 3 Pro
      reasoning: {
        max_tokens: 4000  // Same as original thinkingBudget
      }
    })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`OpenRouter API error: ${error.error?.message || response.statusText}`);
  }

  const data = await response.json();
  const lesson = data.choices?.[0]?.message?.content;

  if (!lesson) throw new Error("Model returned an empty response.");

  return lesson;
};
