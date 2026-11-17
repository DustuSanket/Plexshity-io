import { ChatGoogle } from "@langchain/google/node";
import { ChatOpenAI } from "@langchain/openai";
import {
  HumanMessage,
  SystemMessage,
  AIMessage,
  tool,
  createAgent,
} from "langchain";
import * as z from "zod";
import { searchInternet } from "./internet.service.js";

const geminiModel = new ChatGoogle({
  model: "gemini-3.5-flash-lite",
  apiKey: process.env.GEMINI_API_KEY,
});

const nvidiaModel = new ChatOpenAI({
  model: "nvidia/nemotron-3.5-lightning:free",
  apiKey: process.env.OPENROUTER_API_KEY,
  configuration: {
    baseURL: "https://openrouter.ai/api/v1",
  },
});

const searchInternetTool = tool(searchInternet, {
  name: "searchInternet",
  description: "Use this tool to get latest information from the internet. ",
  schema: z.object({
    query: z.string().describe("The search query to look up on the Internet"),
  }),
});

const internetAgent = createAgent({
  model: geminiModel,
  tools: [searchInternetTool],
});

const currentInfoPattern =
  /\b(?:current(?:ly)?|right\s+now|as\s+of|today|tonight|tomorrow|yesterday|latest|recent(?:ly)?|up[-\s]to[-\s]date|real[-\s]time|live|breaking|this\s+(?:week|month|year)|weather|news|exchange\s+rate|currency\s+rate|dollar\s+rate|forex|stock\s+price|share\s+price|market\s+price|price|score|schedule|availability|available|search\s+(?:the\s+)?web|look\s+up|check\s+online|find\s+online|browse\s+the\s+web)\b/i;

export async function generateResponse(allMessages) {
  const messages = [
    new SystemMessage(
      `You are a helpful assistant. For requests that need current facts, use the search results when available and distinguish verified information from uncertainty. For other requests, answer from your existing knowledge and do not claim to have checked live information.`,
    ),
    ...allMessages.map((msg) => {
      if (msg.role === "user") return new HumanMessage(msg.content);
      if (msg.role === "ai") return new AIMessage(msg.content);
      return null;
    }).filter(Boolean),
  ];
  const latestUserMessage = [...allMessages]
    .reverse()
    .find((msg) => msg.role === "user");
  const needsCurrentInfo = currentInfoPattern.test(
    latestUserMessage?.content || "",
  );

  if (needsCurrentInfo) {
    const response = await internetAgent.invoke({ messages });
    return response.messages[response.messages.length - 1].text;
  }

  const response = await geminiModel.invoke(messages);
  return response.text;
}

export async function generateChatTitle(message) {
  const response = await nvidiaModel.invoke([
    new SystemMessage(
      `You are a helpful assistant that generates concise and descriptive titles for chat conversations.
      
      User will provide you with the first message of a chat conversation, and you will generate a title that captures the essence of the conversation in 2-5 words. The title should be clear, relevant, and engaging, giving users a quick understanding of the chat's topic.

      `,
    ),
    new HumanMessage(
      `Generate a title for a chat conversation based on the following first message:
      "${message}"
      `,
    ),
  ]);

  return response.text;
}
