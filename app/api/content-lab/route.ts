import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";
import { buildContentLabPrompt } from "@/lib/agent/contentLabPrompt";
import { Briefing } from "@/types/contentLab";

export const runtime = "nodejs";

function cleanJsonResponse(text: string) {
  return text
    .trim()
    .replace(/^```json/i, "")
    .replace(/^```/i, "")
    .replace(/```$/i, "")
    .trim();
}

function validateBriefing(briefing: Briefing) {
  const requiredFields: Array<keyof Briefing> = [
    "nicho",
    "publicoAlvo",
    "plataforma",
    "objetivo",
    "tomDeVoz",
    "produtoServico",
    "temaPrincipal",
    "frequencia",
  ];

  const missingFields = requiredFields.filter((field) => {
    const value = briefing[field];

    return typeof value !== "string" || value.trim().length < 2;
  });

  return missingFields;
}

export async function POST(request: NextRequest) {
  try {
    const geminiApiKey = process.env.GEMINI_API_KEY?.trim();
    const geminiModel = process.env.GEMINI_MODEL?.trim() || "gemini-2.5-flash";

    if (!geminiApiKey || geminiApiKey === "sua_chave_gemini_aqui") {
      return NextResponse.json(
        {
          error:
            "A chave da Gemini API não foi encontrada. Configure GEMINI_API_KEY no arquivo .env.local.",
        },
        { status: 500 }
      );
    }

    const ai = new GoogleGenAI({
      apiKey: geminiApiKey,
    });

    const briefing = (await request.json()) as Briefing;

    const missingFields = validateBriefing(briefing);

    if (missingFields.length > 0) {
      return NextResponse.json(
        {
          error: "Preencha todos os campos antes de gerar o conteúdo.",
          missingFields,
        },
        { status: 400 }
      );
    }

    const prompt = buildContentLabPrompt(briefing);

    const response = await ai.models.generateContent({
      model: geminiModel,
      contents: prompt,
      config: {
        systemInstruction:
          "Você é um agente profissional de criação de conteúdo para redes sociais. Responda apenas em JSON válido, sem markdown, sem comentários e sem texto extra.",
        responseMimeType: "application/json",
      },
    });

    const rawText = response.text;

    if (!rawText) {
      throw new Error("A Gemini API não retornou texto.");
    }

    const cleanedText = cleanJsonResponse(rawText);
    const result = JSON.parse(cleanedText);

    return NextResponse.json({ result });
  } catch (error) {
    console.error("Erro no Content Lab IA:", error);

    const errorMessage =
      error instanceof Error ? error.message : "Erro desconhecido.";

    if (
      errorMessage.includes("401") ||
      errorMessage.includes("UNAUTHENTICATED") ||
      errorMessage.includes("ACCESS_TOKEN_TYPE_UNSUPPORTED")
    ) {
      return NextResponse.json(
        {
          error:
            "A chave da Gemini API parece inválida ou é do tipo errado. Crie uma nova chave no Google AI Studio e atualize o GEMINI_API_KEY no .env.local.",
        },
        { status: 401 }
      );
    }

    return NextResponse.json(
      {
        error:
          "Não foi possível gerar o conteúdo agora. Verifique sua chave da Gemini API, o modelo escolhido ou tente novamente.",
      },
      { status: 500 }
    );
  }
}