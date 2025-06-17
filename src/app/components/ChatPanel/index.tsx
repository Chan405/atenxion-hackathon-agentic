"use client";
import { Box, Typography } from "@mui/material";
import SendMessageComponent from "../Common/SendMessageComponent";
import { chat } from "@/app/service/chatService";
import { useEffect, useRef, useState } from "react";
import ChatQuestion from "../Common/ChatQuestion";
import ChatResponse from "../Common/ChatResponse";
import React from "react";
import SpecialResponse from "../Common/SpecialResponse";
import { getAllAgentics } from "@/actions/agenticAction";
import { useRouter } from "next/navigation";

const ChatPanel = ({ id }: { id: string }) => {
  const [question, setQuestion] = useState("");
  const [streamingMessage, setStreamingMessage] = useState("");
  const [streaming, setStreaming] = useState(false);
  const messageRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [agents, setAgents] = useState([]);
  const router = useRouter();
  const scrollToBottom = () => {
    messageRef.current?.scrollTo({
      behavior: "smooth",
      top: messageRef.current.scrollHeight,
    });
  };

  useEffect(() => scrollToBottom(), [streamingMessage, messages]);

  const submitMessage = async () => {
    setMessages((prev) => [...prev, { text: question, user: true }]);
    setQuestion("");
    await chat(
      id,
      question,
      streamingMessage,
      setStreamingMessage,
      setMessages,
      setStreaming
    );
  };

  useEffect(() => {
    const fetch = async () => {
      const agents = await getAllAgentics();
      setAgents(agents.data);
    };
    fetch();
  }, []);

  const currentAgent = agents?.filter((agent) => agent?._id === id)[0];
  return (
    <Box
      width={"100%"}
      height={"100vh"}
      display={"flex"}
      alignItems={"center"}
      boxSizing={"border-box"}
      gap={2}
      py={2}
    >
      <Box
        width={"20%"}
        height={"100%"}
        borderRight={"1px solid #e6e6e6"}
        display={"flex"}
        flexDirection={"column"}
        alignItems={"center"}
        gap={1}
      >
        {agents?.length > 0 &&
          agents.map((agent, index) => (
            <Box
              key={index}
              color={"black"}
              py={1}
              my={2}
              borderRadius={"8px"}
              width={"300px"}
              bgcolor={id === agent?._id ? "#FCECDD" : "transparent"}
              border={"1px solid black"}
              sx={{ cursor: "pointer" }}
              onClick={() => {
                if (id === agent?._id) return;
                else router.push(`/chat/${agent?._id}`);
              }}
            >
              <Typography textAlign={"center"} fontSize={16}>
                {agent?.name}
              </Typography>
            </Box>
          ))}
      </Box>
      <Box
        width={"70%"}
        height={"85vh"}
        border={"1px solid #E6E6E6"}
        margin={"auto"}
        borderRadius={"12px"}
        p={1}
        gap={2}
        display={"flex"}
        flexDirection={"column"}
        alignItems={"center"}
        justifyContent={"space-between"}
        boxSizing={"border-box"}
      >
        <Box
          width={"100%"}
          height={"50px"}
          borderBottom={"1px solid #e6e6e6"}
          display={"flex"}
          alignContent={"center"}
          justifyContent={"space-between"}
        >
          <Typography alignSelf={"center"} pl={2} fontWeight={600}>
            {currentAgent?.name || ""}
          </Typography>
          <Typography
            sx={{ cursor: "pointer" }}
            alignSelf={"center"}
            pr={2}
            fontWeight={600}
            onClick={() =>
              router.push(`/${currentAgent?.type}-agent/${currentAgent?._id}`)
            }
          >
            Edit
          </Typography>
        </Box>
        <Box
          width={"100%"}
          height={"100%"}
          borderRadius={"12px"}
          boxSizing={"border-box"}
          p={1}
          maxHeight={"100%"}
          overflow={"auto"}
          ref={messageRef}
        >
          {messages.map((msg, index) => {
            if (msg?.user) return <ChatQuestion msg={msg?.text} key={index} />;
            else
              return (
                <Box
                  key={index}
                  display={"flex"}
                  flexDirection={"column"}
                  justifyContent={"center"}
                  gap={1}
                >
                  {msg?.toolCall && <SpecialResponse msg={msg?.toolCall} />}
                  {msg?.agentCall && <SpecialResponse msg={msg?.agentCall} />}
                  {msg?.text && <ChatResponse msg={msg?.text} />}
                </Box>
              );
          })}
          {streamingMessage?.length > 0 && streaming && (
            <ChatResponse msg={streamingMessage} />
          )}
        </Box>
        <SendMessageComponent
          setQuestion={setQuestion}
          question={question}
          submitMessage={submitMessage}
        />
      </Box>
    </Box>
  );
};

export default ChatPanel;
