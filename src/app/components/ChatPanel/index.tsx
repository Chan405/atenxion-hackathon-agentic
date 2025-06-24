/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Modal,
  Typography,
} from "@mui/material";
import SendMessageComponent from "../Common/SendMessageComponent";
import { chat } from "@/app/service/chatService";
import { useEffect, useRef, useState } from "react";
import ChatQuestion from "../Common/ChatQuestion";
import ChatResponse from "../Common/ChatResponse";
import React from "react";
import SpecialResponse from "../Common/SpecialResponse";
import LiveTvIcon from "@mui/icons-material/LiveTv";
import {
  clearConversation,
  getAgenticById,
  getAllAgentics,
  getMessageByAgentId,
} from "@/actions/agenticAction";
import { useParams, useRouter } from "next/navigation";
import { GiBroom } from "react-icons/gi";
import { FaRegEdit } from "react-icons/fa";
import { RiRobot3Fill } from "react-icons/ri";
import { io, Socket } from "socket.io-client";

import { ReactFlowProvider, useEdgesState, useNodesState } from "@xyflow/react";
import { SequentialAgentCanvas } from "../SequentialAgentForm/SequentialAgentCanvas";
import {
  initialEdges,
  initialNodes,
} from "../LLMDrivenAgentForm/LLMDrivenAgentCanvas/data";
import { ParallelAgentCanvas } from "../ParallelAgentForm/ParallelAgentCanvas";
import { LLMDrivenAgentCanvas } from "../LLMDrivenAgentForm/LLMDrivenAgentCanvas";

const ChatPanel = ({ id }: { id: string }) => {
  const [question, setQuestion] = useState("");
  const [streamingMessage, setStreamingMessage] = useState("");
  const [streaming, setStreaming] = useState(false);
  const messageRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [agents, setAgents] = useState([]);
  const [prevMessages, setPrevMessages] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [agentName, setAgentName] = useState<string>("");
  const [activeAgentId, setActiveAgentId] = useState<string | null>(null);
  console.log("activeAgentId", activeAgentId);
  const router = useRouter();
  const humanConversationRef = useRef(false);
  let socket: Socket;
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
  const params = useParams();
  const getAgentByID = async () => {
    const response = await getAgenticById(params.id as string);
    console.log("response", response);
    if (response) {
      buildNodesAndEdges(response);
      setAgentName(response.name);
    }
  };

  useEffect(() => scrollToBottom(), [streamingMessage, messages]);

  const buildNodesAndEdges = (agentValue: any) => {
    console.log("agentValue", agentValue);
    const agentType = agentValue?.type; // "sequential", "parallel", or "llmdriven"
    const agents = agentValue?.agents || [];

    // Shared variables
    const START_X = 0;
    const START_Y = 60;
    const NODE_SPACING_X = 300;

    let newNodes: any[] = [];
    let newEdges: any[] = [];

    if (agentType === "sequential") {
      newNodes.push({
        id: "sequential-start",
        type: "startNode",
        position: { x: START_X, y: START_Y },
        data: { label: "sequential-start" },
      });

      agents?.forEach((agent: any, index: number) => {
        const agentId = `middle-node-${index}`;
        const posX = START_X + NODE_SPACING_X * (index + 1);

        newNodes.push({
          id: agentId,
          type: "middleNode",
          position: { x: posX, y: START_Y },
          data: {
            fields: {
              name: agent.name,
              model: agent.chatmodel,
              instruction: agent.instruction || "",
              temperature: parseFloat(agent.temperature),
              topP: parseFloat(agent.topP),
              tools: agent.tools || [],
              maxOutputToken: parseInt(agent.maxTokens),
              description: agent.description || "",
              outputKeys: agent.outputKeys || [],
              datastore: agent.datastore || "",
            },
            activeAgentId: activeAgentId,
          },
        });
        const sourceId =
          index === 0 ? "sequential-start" : `middle-node-${index - 1}`;
        newEdges.push(
          index == 0 || index === agents?.length - 1
            ? {
                id: `e${index}`,
                source: sourceId,
                target: agentId,
              }
            : {
                id: `e${index}`,
                source: sourceId,
                target: agentId,
                targetHandle: "input",
              }
        );
      });

      const outputNodeId = "sequential-output";
      const outputPosX = START_X + NODE_SPACING_X * (agents?.length + 1);
      newNodes.push({
        id: outputNodeId,
        type: "outputNode",
        position: { x: outputPosX, y: START_Y },
        data: { label: "sequential-output" },
      });

      if (agents?.length > 0) {
        newEdges.push({
          id: `e${agents.length}`,
          source: `middle-node-${agents.length - 1}`,
          target: outputNodeId,
          targetHandle: "output",
          style: { stroke: "#4dd0e1" },
          markerEnd: { type: "arrowclosed", color: "#4dd0e1" },
        });
      }
    } else if (agentType === "parallel") {
      const OUTPUT_X = 680;
      const MERGE_X = 460;
      const MERGE_Y = 200;
      const AGENT_X = 170;

      newNodes = [
        {
          id: "parallel-start",
          type: "startNode",
          position: { x: START_X, y: START_Y },
          data: { label: "Start" },
        },
        {
          id: "merge-node",
          type: "mergeNode",
          position: { x: MERGE_X, y: MERGE_Y },
          data: { label: "Merge" },
        },
        {
          id: "parallel-output",
          type: "outputNode",
          position: { x: OUTPUT_X, y: START_Y },
          data: { label: "Output" },
        },
      ];

      newEdges = [];

      agents?.forEach((agent: any, index: number) => {
        const agentId = `middle-node-${index}`;
        const posY = START_Y + index * 150;
        newNodes.push({
          id: agentId,
          type: "middleNode",
          position: { x: AGENT_X, y: posY },
          data: {
            fields: {
              name: agent.name,
              model: agent.chatmodel,
              instruction: agent.instruction || "",
              temperature: parseFloat(agent.temperature),
              topP: parseFloat(agent.topP),
              tools: agent.tools || [],
              maxOutputToken: parseInt(agent.maxTokens),
              description: agent.description || "",
              outputKeys: agent.outputKeys || "",
              datastore: agent.datastore || "",
            },
            activeAgentId: activeAgentId,
          },
        });

        newEdges.push(
          { id: `e-start-${index}`, source: "parallel-start", target: agentId },
          { id: `e-merge-${index}`, source: agentId, target: "merge-node" }
        );
      });

      newEdges.push({
        id: "e-output",
        source: "merge-node",
        target: "parallel-output",
      });
    } else if (agentType === "llmdriven") {
      newNodes.push({
        id: "llmdriven-start",
        type: "startNode",
        position: { x: START_X, y: START_Y + 60 },
        data: { label: "llmdriven-start" },
      });

      const orchestrator = agents?.filter(
        (agent: any) => agent.isOrchestrator
      )[0];

      newNodes.push({
        id: "orchestrator",
        type: "middleNode",
        position: { x: 200, y: START_Y + 60 },
        data: {
          fields: {
            name: orchestrator.name || "Orchestrator",
            model: orchestrator.chatmodel || "gpt-4.1",
            instruction: orchestrator.instruction || "",
            temperature: parseFloat(orchestrator.temperature) || 0.7,
            topP: parseFloat(orchestrator.topP) || 1.0,
            tools: orchestrator.tools || [],
            maxOutputToken: parseInt(orchestrator.maxTokens) || 16000,
            description: orchestrator.description || "",
            outputKeys: orchestrator.outputKeys || [],
            isOrchestrator: true,
          },
          activeAgentId: activeAgentId,
        },
      });

      if (agents?.length > 2) {
        agents
          ?.filter((ag: any) => !ag.isOrchestrator)
          .forEach((agent: any, index: number) => {
            const agentId = `middle-node-${index}`;
            const posY = START_Y + index * 150;

            newNodes.push({
              id: agentId,
              type: "middleNode",
              position: { x: 450, y: posY },
              data: {
                fields: {
                  name: agent.name,
                  model: agent.chatmodel,
                  instruction: agent.instruction || "",
                  temperature: parseFloat(agent.temperature),
                  topP: parseFloat(agent.topP),
                  tools: agent.tools || [],
                  maxOutputToken: parseInt(agent.maxTokens),
                  description: agent.description || "",
                  outputKeys: agent.outputKeys || [],
                  isOrchestrator: agent.isOrchestrator || false,
                  datastore: agent.datastore || "",
                },
                activeAgentId: activeAgentId,
              },
            });

            newEdges.push(
              {
                id: `e-start-${index}`,
                source: "orchestrator",
                target: agentId,
              },
              {
                id: `e-merge-${index}`,
                source: agentId,
                target: "llmdriven-output",
              }
            );
          });
      }

      newEdges.push({
        id: `e2`,
        source: "orchestrator",
        target: "llmdriven-output",
        targetHandle: "output",
      });

      newEdges.push({
        id: "e-start",
        source: "llmdriven-start",
        target: "orchestrator",
      });

      const outputNodeId = "llmdriven-output";
      newNodes.push({
        id: outputNodeId,
        type: "outputNode",
        position: { x: 700, y: START_Y + 60 },
        data: { label: "llmdriven-output" },
      });
    } else {
      console.warn("Unknown agent type:", agentType);
    }

    setNodes(newNodes);
    setEdges(newEdges);
  };

  useEffect(() => {
    if (params.id) {
      getAgentByID();
    }
  }, [activeAgentId, params.id]);

  const submitMessage = async () => {
    setMessages((prev) => [...prev, { text: question, user: true }]);
    setQuestion("");
    await chat(
      id,
      question,
      streamingMessage,
      setStreamingMessage,
      setMessages,
      setStreaming,
      setActiveAgentId
    );
  };
  const handleOpen = () => setModalOpen(true);
  const handleClose = () => setModalOpen(false);

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
      setAgents(agents?.data);
      const response = await getMessageByAgentId(id);
      setPrevMessages(response);
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
            <LiveTvIcon
              sx={{ color: "white", cursor: "pointer" }}
              fontSize="medium"
              onClick={handleOpen}
            />
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
        <Modal
          open={modalOpen}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box>
            <Box
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: "80vw",
                height: "80vh",
                bgcolor: "background.paper",
                boxShadow: 24,
                p: 4,
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Typography id="modal-modal-title" variant="h6" component="h2">
                Agent Flow: {currentAgent?.name}
              </Typography>
              <Box sx={{ flexGrow: 1, position: "relative" }}>
                <ReactFlowProvider>
                  {currentAgent?.type === "sequential" && (
                    <SequentialAgentCanvas
                      nodes={nodes}
                      edges={edges}
                      onNodesChange={() => {}}
                      onEdgesChange={() => {}}
                      onConnect={() => {}}
                      addAgentNode={() => {}}
                      handleNodeDoubleClick={() => {}}
                    />
                  )}
                  {currentAgent?.type === "parallel" && (
                    <ParallelAgentCanvas
                      nodes={nodes}
                      edges={edges}
                      onNodesChange={() => {}}
                      onEdgesChange={() => {}}
                      onConnect={() => {}}
                      addAgentNode={() => {}}
                      handleNodeDoubleClick={() => {}}
                      handleMergeDoubleClick={() => {}}
                    />
                  )}
                  {currentAgent?.type === "llmdriven" && (
                    <LLMDrivenAgentCanvas
                      nodes={nodes}
                      edges={edges}
                      onNodesChange={() => {}}
                      onEdgesChange={() => {}}
                      onConnect={() => {}}
                      addAgentNode={() => {}}
                      handleNodeDoubleClick={() => {}}
                    />
                  )}
                </ReactFlowProvider>
              </Box>
            </Box>
          </Box>
        </Modal>
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
                    <Box width="100%">
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
                    </Box>

                    <Box>
                      {chain?.toolsUsage?.length > 0 && (
                        <SpecialResponse
                          msg={chain?.toolsUsage}
                          isParallel={chain?.parallel}
                          isTool
                        />
                      )}
                      {chain?.humanResponse && (
                        <ChatResponse
                          msg={chain?.humanResponse}
                          isHuman={true}
                        />
                      )}

                      {chain?.agentResponse && (
                        <ChatResponse msg={chain?.agentResponse} />
                      )}

                      {chain?.isHumanEnded && (
                        <ChatResponse
                          msg="👋 Human left the conversation"
                          isSystem={true}
                        />
                      )}
                    </Box>
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
