import ChatPanel from "@/app/components/ChatPanel";
import React from "react";

function ChatWindow({ params }: { params: { id: string } }) {
  return <ChatPanel id={params.id} />;
}

export default ChatWindow;
