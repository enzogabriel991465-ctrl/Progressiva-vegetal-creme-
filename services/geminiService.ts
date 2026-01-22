
import { GoogleGenAI, Type } from "@google/genai";
import { MorningEssence } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });

export const getMorningEssence = async (location?: string): Promise<MorningEssence> => {
  const model = "gemini-3-flash-preview";
  
  const prompt = `Gere uma mensagem calorosa de "Bão Dia" para o usuário. 
  Se a localização for fornecida, mencione algo suave sobre o clima ou o dia lá. 
  Localização: ${location || "Desconhecida"}.
  Retorne um JSON com:
  - greeting: Uma saudação amigável e regional (estilo mineiro/interiorano gentil).
  - quote: Uma citação inspiradora curta.
  - wordOfDay: Uma palavra interessante do português com significado.
  - tip: Uma dica de bem-estar para a manhã.`;

  const response = await ai.models.generateContent({
    model,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          greeting: { type: Type.STRING },
          quote: { type: Type.STRING },
          wordOfDay: {
            type: Type.OBJECT,
            properties: {
              word: { type: Type.STRING },
              meaning: { type: Type.STRING },
            },
            required: ["word", "meaning"]
          },
          tip: { type: Type.STRING },
        },
        required: ["greeting", "quote", "wordOfDay", "tip"]
      }
    }
  });

  try {
    return JSON.parse(response.text || "{}");
  } catch (error) {
    console.error("Erro ao analisar resposta do Gemini:", error);
    return {
      greeting: "Bão dia! Que seu dia seja iluminado.",
      quote: "A jornada de mil milhas começa com um único passo.",
      wordOfDay: { word: "Resiliência", meaning: "Capacidade de se adaptar às mudanças." },
      tip: "Beba um copo de água ao acordar."
    };
  }
};

export const generateImage = async (prompt: string): Promise<string | null> => {
  const imageAi = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });
  try {
    const response = await imageAi.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          { text: `Uma representação artística de: ${prompt}. Estilo de pintura a óleo suave ou fotografia artística de alta qualidade.` },
        ],
      },
      config: {
        imageConfig: {
          aspectRatio: "1:1"
        }
      }
    });

    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    return null;
  } catch (error) {
    console.error("Erro ao gerar imagem:", error);
    return null;
  }
};
