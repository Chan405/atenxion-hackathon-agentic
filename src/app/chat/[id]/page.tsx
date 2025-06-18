"use client";

import React from "react";
import { useParams } from "next/navigation";
import ChatPanel from "@/app/components/ChatPanel";

function ChatWindow() {
  const params = useParams();
  const id = params?.id as string; // Optional chaining for safety

  return <ChatPanel id={id} />;
}

export default ChatWindow;
