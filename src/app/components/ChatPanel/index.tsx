/* eslint-disable @typescript-eslint/no-explicit-any */
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
  const [loading, setLoading] = useState(false);
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

  const currentAgent: any = agents?.filter(
    (agent: any) => agent?._id === id
  )[0];
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
      >
        <Typography
          textAlign={"center"}
          fontSize={20}
          fontWeight={800}
          color="#052659"
          mt={5}
          mb={3}
        >
          Atenxion Multi Agents
        </Typography>
        {agents?.length > 0 &&
          agents.map((agent: any, index: number) => (
            <Box
              key={index}
              color={id === agent?._id ? "white" : "#052659"}
              py={1}
              mt={2}
              borderRadius={"8px"}
              width={"250px"}
              bgcolor={id === agent?._id ? "#052659" : "transparent"}
              border={"1px solid #052659"}
              sx={{ cursor: "pointer" }}
              onClick={() => {
                if (id === agent?._id) return;
                else router.push(`/chat/${agent?._id}`);
              }}
            >
              <Typography textAlign={"center"} fontSize={14}>
                {agent?.name}
              </Typography>
            </Box>
          ))}
        <Box
          color={"white"}
          py={1}
          mt={2}
          borderRadius={"8px"}
          width={"250px"}
          bgcolor={"#052659"}
          border={"1px solid #052659"}
          sx={{ cursor: "pointer" }}
          onClick={() => {
            router.push("/");
          }}
          position={"absolute"}
          bottom={25}
        >
          <Typography textAlign={"center"} fontSize={14}>
            Home
          </Typography>
        </Box>
      </Box>
      <Box
        width={"70%"}
        height={"85vh"}
        border={"1px solid #E6E6E6"}
        margin={"auto"}
        borderRadius={"12px"}
        gap={1}
        display={"flex"}
        flexDirection={"column"}
        alignItems={"center"}
        justifyContent={"space-between"}
        boxSizing={"border-box"}
      >
        <Box
          width={"100%"}
          height={"70px"}
          borderBottom={"1px solid #e6e6e6"}
          display={"flex"}
          bgcolor={"#052659"}
          borderRadius={"8px 8px 0px 0px"}
          alignContent={"center"}
          justifyContent={"space-between"}
        >
          <Typography
            alignSelf={"center"}
            color="white"
            pl={2}
            fontWeight={600}
          >
            {currentAgent?.name || ""}
          </Typography>
          <Typography
            sx={{ cursor: "pointer" }}
            alignSelf={"center"}
            pr={2}
            color="white"
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
          p={2}
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
                  {msg?.agentCall && (
                    <SpecialResponse
                      msg={msg?.agentCall}
                      isParallel={msg.parallel}
                    />
                  )}
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
          streaming={streaming}
        />
      </Box>
    </Box>
  );
};

export default ChatPanel;
