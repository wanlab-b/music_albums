import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getAlbumAnalysis = async (artist: string, albumTitle: string) => {
  try {
    const prompt = `
      당신은 냉철하고 전문적인 음악 평론가입니다.
      다음 앨범에 대해 한국어로 짧고 굵은 비평을 작성해주세요:
      아티스트: ${artist}
      앨범: ${albumTitle}

      다음 형식을 반드시 지켜주세요:
      1. 한 줄 총평 (굵게)
      2. 앨범의 음악적 특징 및 장르 분석 (2문장 이내)
      3. 주요 트랙 추천 (1~2곡)
      4. 이 앨범을 들어야 하는 이유
      
      말투는 '해요'체를 사용하되, 전문성을 잃지 마세요. 전체 길이는 300자 이내로 유지하세요.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        temperature: 0.7,
      }
    });

    return response.text || "분석을 생성할 수 없습니다.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "현재 AI 분석 서비스를 이용할 수 없습니다.";
  }
};