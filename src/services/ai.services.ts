import OpenAI from "openai";
import { Transaction } from "@/generated/prisma/client";
import dotenv from "dotenv"

dotenv.config()

// Initialize Groq client
const client = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1", 
});

// Helper to format transactions
const formatTransactions = (transactions: Transaction[]) => {
  return transactions.map(t => 
    `- ${t.createdAt.toISOString().split('T')[0]}: ${t.description || 'No description'} | #${t.amount} | Category: ${t.category} | Type: ${t.type}`
  ).join('\n');
};

/**
 * 1. GET INSIGHTS (Using Llama 3)
 */
export const generateInsights = async (transactions: Transaction[], monthlyIncome: number) => {
  const transactionSummary = formatTransactions(transactions);

  const completion = await client.chat.completions.create({
    messages: [
      {
        role: "system",
        content: "You are a financial analyst. Return purely valid JSON with no markdown formatting."
      },
      {
        role: "user",
        content: `
          Analyze these transactions and income (#${monthlyIncome}).
          Transactions:
          ${transactionSummary}

          Return JSON with this structure:
          {
            "summary": "One sentence summary",
            "tips": ["Tip 1", "Tip 2", "Tip 3"],
            "sentiment": "Positive" | "Neutral" | "Negative"
          }
        `
      }
    ],
    model: "openai/gpt-oss-safeguard-20b", // Free, fast, and smart model
    temperature: 0.5,
  });

  const content = completion.choices[0]?.message?.content || "{}";
  // Clean up any potential markdown backticks
  return JSON.parse(content.replace(/```json/g, '').replace(/```/g, '').trim());
};

/**
 * 2. GET BUDGET (Using Llama 3)
 */
export const generateBudgetPlan = async (transactions: any[], monthlyIncome: number) => {
  const transactionSummary = formatTransactions(transactions);

  const completion = await client.chat.completions.create({
    messages: [
      {
        role: "system",
        content: "You are a budget planner. Return purely valid JSON with no markdown formatting."
      },
      {
        role: "user",
        content: `
          Create a monthly budget based on income (#${monthlyIncome}) and these past transactions:
          ${transactionSummary}

          Return JSON with this structure:
          {
            "totalBudget": number,
            "recommendations": [
              { "category": "Food", "suggestedLimit": number, "reason": "string" }
            ]
          }
        `
      }
    ],
    model: "openai/gpt-oss-safeguard-20b",
    temperature: 0.5,
  });

  const content = completion.choices[0]?.message?.content || "{}";
  return JSON.parse(content.replace(/```json/g, '').replace(/```/g, '').trim());
};