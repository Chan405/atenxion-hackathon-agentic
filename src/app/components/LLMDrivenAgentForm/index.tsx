/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { Box, Typography } from "@mui/material";
import React, { useCallback, useEffect, useState } from "react";
import ButtonComponent from "../Common/ButtonComponent";

import Input from "../Common/Input";
import { LLMDrivenAgentCanvas } from "./LLMDrivenAgentCanvas";
import { addEdge, useEdgesState, useNodesState } from "@xyflow/react";
import { initialEdges, initialNodes } from "./LLMDrivenAgentCanvas/data";
import AgentCreateModal from "../Common/AgentCreateModal";
import {
  createAgentic,
  editAgentic,
  getAgenticById,
} from "@/actions/agenticAction";
import { useParams, useRouter } from "next/navigation";

export const AGENT_X = 500;
export const AGENT_Y_GAP = 100;

function LLMDrivenAgentForm() {
  const params = useParams();
  const router = useRouter();

  const [agentName, setAgentName] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedNode, setSelectedNode] = useState<any>(null);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  // const onConnect = useCallback(
  //   (params: any) =>
  //     setEdges((eds) =>
  //       addEdge(
  //         {
  //           ...params,
  //           type: "custom",
  //           data: { isFinal: true },
  //         },
  //         eds
  //       )
  //     ),
  //   [setEdges]
  // );

  const onConnect = useCallback(
    (param: any) => setEdges((eds) => addEdge(param, eds)),
    [setEdges]
  );

  const handleNodeDoubleClick = (node: any) => {
    setSelectedNode(node);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedNode(null);
  };

  // const addAgentNode = () => {
  //   const START_Y = 60;
  //   const orchestratorNode = nodes.find((n) => n.id === "orchestrator");
  //   if (!orchestratorNode) return;

  //   // Find edge from orchestrator
  //   const edgeFromOrchestrator = edges.find((e) => e.source === "orchestrator");
  //   if (!edgeFromOrchestrator) return;

  //   const oldTargetId = edgeFromOrchestrator.target;
  //   const newNodeId = `agent-${Date.now()}`; // unique ID

  //   const agentNodes = nodes.filter((n) => n.type === "middleNode");

  //   // New node position: adjust slightly to the right

  //   const newNode = {
  //     id: newNodeId,
  //     type: "middleNode",
  //     position: {
  //       x: orchestratorNode.position.x + 200,
  //       y: orchestratorNode.position.y + 100,
  //     },
  //     data: {
  //       fields: {
  //         name: `Agent ${agentNodes.length}`,
  //         model: "gpt-4.1",
  //         instruction: "",
  //         temperature: 0.5,
  //         topP: 1.0,
  //         tools: [],
  //         maxOutputToken: 100,
  //         description: "",
  //         outputKeys: [],
  //       },
  //     },
  //     onDoubleClick: () => handleNodeDoubleClick(newNode),
  //   };

  //   const newEdges = [
  //     {
  //       id: `orchestrator-${newNodeId}`,
  //       source: "orchestrator",
  //       target: newNodeId,
  //       type: "custom",
  //     },
  //     {
  //       id: `${newNodeId}-${oldTargetId}`,
  //       source: newNodeId,
  //       target: oldTargetId,
  //       type: "custom",
  //     },
  //   ];

  //   // Update state
  //   setNodes((nds) => [...nds, newNode]);
  //   setEdges((eds) => [
  //     ...eds.filter((e) => e.id !== edgeFromOrchestrator.id),
  //     ...newEdges,
  //   ]);
  // };

  const addAgentNode = () => {
    const START_Y = 0;
    const agentNodes = nodes.filter((n) => n.type === "middleNode");
    const count = agentNodes.length;
    const newNodeId = `middle-node-${Date.now()}`;

    const newNode = {
      id: newNodeId,
      type: "middleNode",
      position: {
        x: AGENT_X,
        y: START_Y + count * AGENT_Y_GAP,
      },
      data: {
        fields: {
          name: `Agent ${count + 1}`,
          model: "gpt-4.1",
          instruction: "",
          temperature: 0.5,
          topP: 1.0,
          tools: [],
          maxOutputToken: 100,
          description: "",
          outputKeys: [],
          isOrchestrator: false,
          datastore: "",
        },
      },
    };

    // const tempEdges = edges.filter((e) => e.id !== "e2");

    const newEdges = [
      ...edges,
      {
        id: `e-start-${newNodeId}`,
        source: "orchestrator",
        target: newNodeId,
      },
      {
        id: `e-${newNodeId}-output`,
        source: newNodeId,
        // target: "parallel-output",
        target: "llmdriven-output",
      },
    ];

    const updatedNodes = nodes.map((n) => {
      if (n.id === "llmdriven-output") {
        return {
          ...n,
          position: {
            x: newNode.position.x + 300,
            y: n.position.y,
          },
        };
      }
      return n;
    });

    // @ts-expect-error // React Flow types
    setNodes([...updatedNodes, newNode]);
    setEdges(newEdges);
  };

  const handleDeleteNode = useCallback(
    (nodeId: string) => {
      const agentNodes = nodes.filter((node) => node.data?.fields);
      if (agentNodes.length < 2) return;

      setNodes((nds) => {
        const deletedNode = nds.find((n) => n.id === nodeId);
        const isMiddleNode = deletedNode?.type === "middleNode";

        const updatedNodes = nds.filter((n) => n.id !== nodeId);

        if (!isMiddleNode) return updatedNodes;

        // If we deleted a middle node, update output node position
        const remainingMiddleNodes = updatedNodes
          .filter((n) => n.type === "middleNode")
          .sort((a, b) => a.position.x - b.position.x);

        if (remainingMiddleNodes.length > 0) {
          const lastNode =
            remainingMiddleNodes[remainingMiddleNodes.length - 1];
          return updatedNodes.map((n) =>
            n.id === "llmdriven-output"
              ? {
                  ...n,
                  position: {
                    x: lastNode.position.x + 200,
                    y: lastNode.position.y,
                  },
                }
              : n
          );
        }

        return updatedNodes;
      });

      setEdges((eds) => {
        // Remove any edge connected to the deleted node
        let filteredEdges = eds.filter(
          (e) => e.source !== nodeId && e.target !== nodeId
        );

        // If a middle node was deleted, reconnect the last one to output
        const remainingMiddleNodes = nodes
          .filter((n) => n.id !== nodeId && n.type === "middleNode")
          .sort((a, b) => a.position.x - b.position.x);

        if (remainingMiddleNodes.length > 0) {
          const lastNode =
            remainingMiddleNodes[remainingMiddleNodes.length - 1];

          // Remove any existing edge from last middle node to output to prevent duplicates
          filteredEdges = filteredEdges.filter(
            (e) =>
              !(e.source === lastNode.id && e.target === "llmdriven-output")
          );

          // Add the edge from last remaining middle node to output
          filteredEdges.push({
            id: `e-${lastNode.id}-llmdriven-output`,
            source: lastNode.id,
            target: "llmdriven-output",
          });
        }

        return filteredEdges;
      });

      setSelectedNode(null);
      setIsModalOpen(false);
    },
    [nodes]
  );

  const buildLlmdrivenNodesAndEdges = (agentValue: any) => {
    const agents = agentValue?.agents || [];

    const newNodes: any[] = [];
    const newEdges: any[] = [];

    const START_X = 0;
    const START_Y = 60;
    // const NODE_SPACING_X = 300;

    newNodes.push({
      id: "llmdriven-start",
      type: "startNode",
      position: { x: START_X, y: START_Y + 60 },
      data: { label: "llmdriven-start" },
    });

    const orchestrator = agents.filter((agent: any) => agent.isOrchestrator)[0];

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
      },
    });

    agents
      .filter((ag: any) => !ag.isOrchestrator)
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
          },
        });

        newEdges.push(
          { id: `e-start-${index}`, source: "orchestrator", target: agentId },
          {
            id: `e-merge-${index}`,
            source: agentId,
            target: "llmdriven-output",
          }
        );

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

        // const sourceId =
        //   index === 0 ? "llmdriven-start" : `middle-node-${index - 1}`;
        // newEdges.push(
        //   index == 0 || index === agents.length - 1
        //     ? {
        //         id: `e${index}`,
        //         source: sourceId,
        //         target: agentId,
        //       }
        //     : {
        //         id: `e${index}`,
        //         source: sourceId,
        //         target: agentId,
        //         targetHandle: "input",
        //       }
        // );
      });

    const outputNodeId = "llmdriven-output";
    newNodes.push({
      id: outputNodeId,
      type: "outputNode",
      position: { x: 700, y: START_Y + 60 },
      data: { label: "llmdriven-output" },
    });

    setNodes(newNodes);
    setEdges(newEdges);
  };

  const handleSaveAgent = (id: string, values: any) => {
    console.log("handleSaveAgent", id, values);
    setNodes((prevNodes) =>
      prevNodes.map((node) =>
        node.id === id
          ? {
              ...node,
              data: {
                ...node.data,
                ...values,
                fields: {
                  ...node.data.fields,
                  ...values,
                },
              },
            }
          : node
      )
    );
    setIsModalOpen(false);
    setSelectedNode(null);
  };

  // api integration
  const getAgentByID = async () => {
    const response = await getAgenticById(params.id as string);
    if (response) {
      buildLlmdrivenNodesAndEdges(response);
      setAgentName(response.name);
    }
  };

  const handleCreateOrUpdateAgent = async () => {
    const agentNodes = nodes.filter((node) => node.data?.fields);
    console.log("agentNodes", agentNodes, edges);

    const agents = agentNodes.map((node) => {
      const fields = node.data.fields;

      if (fields) {
        return {
          name: fields.name,
          instruction: fields.instruction,
          temperature: String(fields.temperature),
          tools: Array.isArray(fields.tools)
            ? fields.tools
            : typeof fields.tools === "string"
            ? [fields.tools]
            : [],
          chatmodel: fields.model,
          description: fields.description,
          topP: String(fields.topP),
          maxTokens: String(fields.maxOutputToken),
          outputKeys: fields.outputKeys,
          isOrchestrator: fields.isOrchestrator || false,
          datastore: fields.datastore || "",
        };
      }
    });

    const agentic = {
      name: agentName,
      type: "llmdriven",
      agents,
    };
    let response;

    if (params.id) {
      console.log("editing", agentic);
      response = await editAgentic(params.id as string, agentic);
    } else {
      console.log("creating", agentic);
      response = await createAgentic(agentic);
    }
    console.log(response);
    if (response.status === "success") {
      router.push(`/chat/${response.data}`);
    }
  };

  useEffect(() => {
    if (params.id) {
      getAgentByID();
    }
  }, []);

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        bgcolor: "#052659",
      }}
    >
      <Box
        sx={{
          width: "80vw",
          px: 4,
          py: 2,
          display: "flex",
          flexDirection: "column",
          gap: 2,
          border: "1px dashed #77696D",
          borderRadius: "8px",
          m: 2,
          bgcolor: "white",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "end",
            borderBottom: "1px solid #052659",
            pb: 3,
          }}
        >
          <Box
            display={"flex"}
            flexDirection={"column"}
            gap={1}
            alignItems={"start"}
            justifyContent={"center"}
          >
            <Typography fontWeight={600} color="#052659">
              Agent Name
            </Typography>
            <Input
              name="name"
              label="Agent Name"
              value={agentName}
              placeholder="e.g., Customer Onboarding Flow"
              onChange={(e) => {
                setAgentName(e.target.value);
              }}
              width="100%"
              showLabel={false}
            />
          </Box>

          <ButtonComponent
            label="Add Agent"
            onClick={addAgentNode}
            width="140px"
            height="40px"
            color="#052659"
            borderRadius="8px"
          />
        </Box>
        <Box
          sx={{
            height: "60vh",
          }}
        >
          <LLMDrivenAgentCanvas
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            addAgentNode={addAgentNode}
            handleNodeDoubleClick={handleNodeDoubleClick}
          />
        </Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <ButtonComponent
            label={"Back to home"}
            onClick={() => {
              router.push("/");
            }}
            borderRadius="8px"
            width="200px"
            height="50px"
            color="#eee"
            textColor="#000"
          />
          <ButtonComponent
            label={params.id ? "Update Agent" : "Create Multi Agent"}
            onClick={handleCreateOrUpdateAgent}
            width="200px"
            height="50px"
            borderRadius="8px"
            color="#052659"
            disabled={agentName.trim().length === 0}
          />
        </Box>

        {selectedNode && (
          <AgentCreateModal
            open={isModalOpen}
            handleClose={handleModalClose}
            handleSaveAgent={handleSaveAgent}
            selectedNode={selectedNode}
            removeAgent={handleDeleteNode}
          />
        )}
      </Box>
    </Box>
  );
}

export default LLMDrivenAgentForm;
