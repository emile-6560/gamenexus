import { genkit } from 'genkit';
import { googleAI, gemini15Flash, gemini15Pro } from '@genkit-ai/googleai';

// Instance Pro
export const ai = genkit({
  plugins: [googleAI({ apiKey: process.env.GEMINI_API_KEY })],
  model: gemini15Pro, // Modèle par défaut pour 'ai'
});

// Instance Flash (Celle que tu utilises pour les prix)
export const aiFlash = genkit({
  plugins: [googleAI({ apiKey: process.env.GEMINI_API_KEY_FLASH })],
  model: gemini15Flash, // <--- AJOUTE ÇA : Fixe le modèle par défaut pour cette instance
});
