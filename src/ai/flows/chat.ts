
'use server';

/**
 * @fileOverview A conversational chat flow for finding games.
 *
 * - chat - A function that handles a conversational turn.
 */

import {aiFlash} from '@/ai/genkit';
import {
  ChatInput,
  ChatInputSchema,
  ChatOutput,
  ChatOutputSchema,
} from '@/lib/chat-types';

const systemPrompt = `You are a friendly and expert video game assistant named GameFinder.
Your task is to help users discover new video games based on their preferences.
Keep your responses concise, friendly, and helpful.
You can ask clarifying questions to better understand the user's needs.
When you recommend a game, briefly mention why you are recommending it.
Do not recommend more than 3 games at a time unless explicitly asked.
Do not use markdown in your responses.`;


export async function chat(input: ChatInput): Promise<ChatOutput> {
  return chatFlow(input);
}

const chatFlow = aiFlash.defineFlow(
  {
    name: 'chatFlow',
    inputSchema: ChatInputSchema,
    outputSchema: ChatOutputSchema,
  },
  async (input) => {
    const { history } = input;

    const llmResponse = await aiFlash.generate({
      model: 'googleai/gemini-2.5-flash',
      system: systemPrompt,
      history: history,
      config: {
        // You can adjust temperature for more creative or factual responses
        temperature: 0.7,
      },
    });

    return {
      text: llmResponse.text,
    };
  }
);
