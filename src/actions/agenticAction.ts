/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { axiosServerInstance } from "@/app/service/axiosService";

export async function createAgentic(agentic: any) {
  try {
    const response = await axiosServerInstance.post("/", agentic);
    return response?.data;
  } catch (error: any) {
    console.log("error", error?.response?.data);
    throw error;
  }
}

export async function getAllAgentics() {
  try {
    const response = await axiosServerInstance.get("/");
    return response?.data;
  } catch (error: any) {
    console.log("error", error?.response?.data);
    throw error;
  }
}

export async function editAgentic(agentId: string, agentic: any) {
  try {
    const response = await axiosServerInstance.put(`/${agentId}`, agentic);
    return response?.data;
  } catch (error: any) {
    console.log("error", error?.response?.data);
    throw error;
  }
}

export async function getAgenticById(agentId: string) {
  try {
    const response = await axiosServerInstance.get(`/${agentId}`);
    return response?.data?.data;
  } catch (error: any) {
    console.log("error", error?.response?.data);
  }
}

export async function clearConversation(agentId: string) {
  try {
    const response = await axiosServerInstance.get(`/clear-chat/${agentId}`);
    return response?.data?.data;
  } catch (error: any) {
    console.log("error", error?.response?.data);
  }
}

export async function getMessageByAgentId(agentId: string) {
  try {
    const response = await axiosServerInstance.get(`/messages/${agentId}`);
    return response?.data?.data;
  } catch (error: any) {
    console.log("error", error?.response?.data);
  }
}

export async function deleteAgenticById(agentId: string) {
  try {
    const response = await axiosServerInstance.delete(`/${agentId}`);
    return response?.data;
  } catch (error: any) {
    console.log("error", error?.response?.data);
  }
}
