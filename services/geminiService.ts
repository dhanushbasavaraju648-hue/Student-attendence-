import { GoogleGenAI, Type } from "@google/genai";

const getAiClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key is missing");
  }
  return new GoogleGenAI({ apiKey });
};

export interface LivenessAnalysisResponse {
  isReal: boolean;
  confidence: number;
  reason: string;
}

export const analyzeLiveness = async (base64Image: string): Promise<LivenessAnalysisResponse> => {
  try {
    const ai = getAiClient();
    const cleanBase64 = base64Image.replace(/^data:image\/(png|jpg|jpeg);base64,/, "");

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: 'image/jpeg',
              data: cleanBase64
            }
          },
          {
            text: `Analyze this image for a biometric security system (Face Liveness Detection). 
            Determine if the face in the image is a real person present in front of the camera ("Live"), or a presentation attack such as a photo displayed on a screen, a printed paper mask, or a deepfake ("Spoof").
            
            Provide a JSON response.`
          }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            isReal: { type: Type.BOOLEAN, description: "True if real human face, false if spoof/screen/photo." },
            confidence: { type: Type.NUMBER, description: "Confidence score between 0 and 1." },
            reason: { type: Type.STRING, description: "Brief explanation of the visual cues used for decision (e.g., 'Pixelation detected', 'Glare from screen', 'Natural skin texture')." }
          },
          required: ["isReal", "confidence", "reason"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");

    const result = JSON.parse(text) as LivenessAnalysisResponse;
    return result;

  } catch (error) {
    console.error("Liveness check failed:", error);
    return {
      isReal: false,
      confidence: 0,
      reason: "System error during liveness check."
    };
  }
};
