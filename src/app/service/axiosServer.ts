import axios, { AxiosInstance } from "axios";

export const axiosServerInstance: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_URL,
  headers: {
    Accept: "application/json",
  },
  timeout: 600000,
});

export async function chat(agentId: string, message: string) {
  try {
    const streamMessage = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        agentId,
        message,
      }),
    });
    console.log({ streamMessage });
    if (streamMessage?.status === 500) {
      throw new Error("Chat Agent Service Failure");
    }
  } catch (error: any) {
    console.log("Error", error);
  }
}
