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
import {
  clearConversation,
  getAgenticById,
  getAllAgentics,
  getMessageByAgentId,
} from "@/actions/agenticAction";
import { useRouter } from "next/navigation";
import { GiBroom } from "react-icons/gi";
import { FaRegEdit } from "react-icons/fa";
import { RiRobot3Fill } from "react-icons/ri";
import { io, Socket } from "socket.io-client";

let socket: Socket;

const ChatPanel = ({ id }: { id: string }) => {
  const [question, setQuestion] = useState("");
  const [streamingMessage, setStreamingMessage] = useState("");
  const [streaming, setStreaming] = useState(false);
  const messageRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [agents, setAgents] = useState([]);
  const [prevMessages, setPrevMessages] = useState([]);
  const router = useRouter();
  const [currentAgent, setCurrentAgent] = useState<any>(null);
  const humanConversationRef = useRef(false);

  const scrollToBottom = () => {
    messageRef.current?.scrollTo({
      behavior: "smooth",
      top: messageRef.current.scrollHeight,
    });
  };

  useEffect(() => {
    const fetchAgent = async () => {
      try {
        const response = await getAgenticById(id);
        if (response) {
          setCurrentAgent(response);
          if (response?.humanHandover) {
            humanConversationRef.current = true;
          }
        } else {
          console.error("Agent not found");
        }
      } catch (error: any) {
        console.error("Error fetching agent:", error.message);
      }
    };
    fetchAgent();
  }, []);

  useEffect(() => {
    socket = io(`${process.env.NEXT_PUBLIC_WEBSOCKET_URL}`);

    socket.on("connect", () => {
      console.log("Connected to socket.io server");

      // Send message
      socket.emit("message", "Hello from Next.js!");
    });

    socket.on("admin_reply", (data: any) => {
      console.log("human conversation", humanConversationRef.current);

      if (id === data?.agentId) {
        if (!humanConversationRef.current) {
          humanConversationRef.current = true;

          setMessages((prev) => [
            ...prev,
            {
              text: "👩‍💼 " + data?.sender + " joined the conversation",
              user: false,
              system: true,
            },
          ]);
        }

        setMessages((prev) => [
          ...prev,
          { text: data.message, user: false, human: true },
        ]);
      }
    });

    socket.on("conversation_closed", (data: any) => {
      console.log("Conversation closed:", data);
      if (id === data?.agentId) {
        setMessages((prev) => [
          ...prev,
          { text: "👋 Conversation closed", user: false, system: true },
        ]);
        humanConversationRef.current = false;
      }
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected");
    });

    return () => {
      socket.disconnect();
    };
  }, []);

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

  const clearChat = async () => {
    try {
      await clearConversation(currentAgent?._id);
      setPrevMessages([]);
      setMessages([]);
    } catch (error: any) {
      console.error(error.message);
    }
  };

  useEffect(() => {
    const fetch = async () => {
      const agents = await getAllAgentics();
      setAgents(agents.data);
      const response = await getMessageByAgentId(id);
      setPrevMessages(response);
    };
    fetch();
  }, []);

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
        width={"18%"}
        height={"100%"}
        borderRight={"1px solid #e6e6e6"}
        display={"flex"}
        flexDirection={"column"}
        alignItems={"center"}
      >
        <Typography
          textAlign={"center"}
          fontSize={28}
          fontWeight={800}
          color="#052659"
          mt={5}
          mb={3}
          sx={{ cursor: "pointer" }}
          onClick={() => {
            router.push("/");
          }}
        >
          Agentics
        </Typography>
        <Box
          boxSizing={"border-box"}
          height={"80vh"}
          maxHeight={"80vh"}
          overflow={"auto"}
        >
          {agents?.length > 0 &&
            agents.map((agent: any, index: number) => (
              <Box
                key={index}
                color={id === agent?._id ? "white" : "#052659"}
                py={1}
                px={2}
                maxHeight={"50px"}
                overflow={"hidden"}
                boxSizing={"border-box"}
                mt={1.5}
                borderRadius={"8px"}
                width={"230px"}
                bgcolor={id === agent?._id ? "#052659" : "transparent"}
                sx={{ cursor: "pointer" }}
                onClick={() => {
                  if (id === agent?._id) return;
                  else router.push(`/chat/${agent?._id}`);
                }}
              >
                <Box
                  display={"flex"}
                  gap={1.5}
                  alignItems={"center"}
                  justifyContent={"start"}
                >
                  <RiRobot3Fill size={22} />
                  <Typography
                    textAlign={"start"}
                    fontSize={14}
                    overflow="hidden"
                    textOverflow="ellipsis"
                    noWrap
                  >
                    {agent?.name}
                  </Typography>
                </Box>
              </Box>
            ))}
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
          <Box display={"flex"} alignItems={"center"} gap={3} mr={1}>
            <GiBroom
              color="white"
              size={24}
              cursor={"pointer"}
              onClick={clearChat}
            />

            <FaRegEdit
              color="white"
              size={22}
              style={{ marginRight: 14 }}
              cursor={"pointer"}
              onClick={() =>
                router.push(`/${currentAgent?.type}-agent/${currentAgent?._id}`)
              }
            />
          </Box>
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
          {prevMessages?.length > 0 &&
            prevMessages.map((msg: any, index: number) => (
              <Box key={index}>
                {msg?.question && <ChatQuestion msg={msg?.question} />}

                {msg?.chains.map((chain: any, index: number) => (
                  <Box key={index}>
                    {chain?.isHumanStarted && (
                      <ChatResponse
                        msg="👩‍💼 Human joined the conversation"
                        isSystem={true}
                      />
                    )}

                    {chain?.agentName && !chain?.humanResponse && (
                      <SpecialResponse
                        msg={chain?.agentName}
                        isParallel={chain?.isParallel}
                        isAgent
                      />
                    )}

                    {chain?.agentName &&
                      chain?.humanResponse &&
                      !chain?.isHumanEnded && (
                        <ChatResponse
                          msg={
                            "👩‍💼 " +
                            chain?.agentName +
                            " joined the conversation"
                          }
                          isSystem={true}
                        />
                      )}
                    {chain.guardrails && (
                      <Typography
                        fontSize={14}
                        fontWeight={500}
                        color="#052659"
                        mt={1}
                        mb={1}
                      >
                        Guardrails: {chain.guardrails}
                      </Typography>
                    )}
                    {chain?.toolsUsage?.length > 0 && (
                      <SpecialResponse
                        msg={chain?.toolsUsage}
                        isParallel={chain?.parallel}
                        isTool
                      />
                    )}
                    {chain?.humanResponse && (
                      <ChatResponse msg={chain?.humanResponse} isHuman={true} />
                    )}
                    {chain?.agentResponse && (
                      <ChatResponse msg={chain?.agentResponse} />
                    )}

                    {chain?.isHumanEnded && (
                      <ChatResponse
                        msg="👋 Conversation closed"
                        isSystem={true}
                      />
                    )}
                  </Box>
                ))}
              </Box>
            ))}
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
                  {msg?.toolCall && (
                    <SpecialResponse msg={msg?.toolCall} isTool />
                  )}

                  {msg?.agentCall && (
                    <SpecialResponse
                      msg={msg?.agentCall}
                      isParallel={msg.parallel}
                      isAgent
                    />
                  )}
                  {msg?.guardrails && (
                    <Typography
                      fontSize={14}
                      fontWeight={500}
                      color="#052659"
                      mt={1}
                      mb={1}
                    >
                      Guardrails: {msg.guardrails}
                    </Typography>
                  )}

                  {msg?.text && (
                    <ChatResponse
                      msg={msg?.text}
                      isHuman={msg?.human}
                      isSystem={msg?.system}
                    />
                  )}
                </Box>
              );
          })}
          {streamingMessage?.length > 0 && streaming && (
            <ChatResponse msg={streamingMessage} />
          )}
        </Box>
        <SendMessageComponent
          streaming={streaming}
          setQuestion={setQuestion}
          question={question}
          submitMessage={submitMessage}
        />
      </Box>
    </Box>
  );
};

export default ChatPanel;
