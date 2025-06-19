/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { Box, Typography } from "@mui/material";
import React, { useCallback, useEffect, useState } from "react";
import ButtonComponent from "../Common/ButtonComponent";

import Input from "../Common/Input";
import { SequentialAgentCanvas } from "./SequentialAgentCanvas";
import { addEdge, useEdgesState, useNodesState } from "@xyflow/react";
import { initialEdges, initialNodes } from "./SequentialAgentCanvas/data";
import AgentCreateModal from "../Common/AgentCreateModal";
import {
  createAgentic,
  editAgentic,
  getAgenticById,
} from "@/actions/agenticAction";
import { useParams, useRouter } from "next/navigation";

function SequentialAgentForm() {
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

  const addAgentNode = () => {
    const agentNodes = [...nodes].filter((n) => n.type === "middleNode");
    const lastAgent = agentNodes
      .sort((a, b) => a.position.x - b.position.x)
      .pop();

    if (!lastAgent) return;

    const newNodeId = `middle-node-${Date.now()}`;
    const newX = lastAgent.position.x + 250;

    const newNode = {
      id: newNodeId,
      type: "middleNode",
      position: { x: newX, y: lastAgent.position.y },
      data: {
        fields: {
          name: `Agent ${agentNodes.length + 1}`,
          model: "gpt-4.1",
          instruction: "",
          temperature: 0.7,
          topP: 1.0,
          tools: [],
          maxOutputToken: 16000,
          description: "",
        },
        onDoubleClick: () => handleNodeDoubleClick(newNode),
      },
    };

    const updatedNodes = nodes.map((n) => {
      if (n.id === "sequential-output") {
        return {
          ...n,
          position: {
            x: newX + 220,
            y: n.position.y,
          },
        };
      }
      return n;
    });

    const filteredEdges = edges.filter(
      (e) => !(e.source === lastAgent.id && e.target === "sequential-output")
    );

    filteredEdges.push({
      id: `e-${lastAgent.id}-${newNodeId}`,
      source: lastAgent.id,
      target: newNodeId,
    });

    filteredEdges.push({
      id: `e-${newNodeId}-sequential-output`,
      source: newNodeId,
      target: "sequential-output",
    });

    // @ts-expect-error abc
    setNodes([...updatedNodes, newNode]);
    setEdges(filteredEdges);
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
            n.id === "sequential-output"
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
              !(e.source === lastNode.id && e.target === "sequential-output")
          );

          // Add the edge from last remaining middle node to output
          filteredEdges.push({
            id: `e-${lastNode.id}-sequential-output`,
            source: lastNode.id,
            target: "sequential-output",
          });
        }

        return filteredEdges;
      });

      setSelectedNode(null);
      setIsModalOpen(false);
    },
    [nodes]
  );

  const buildSequentialNodesAndEdges = (agentValue: any) => {
    const agents = agentValue?.agents || [];

    const newNodes: any[] = [];
    const newEdges: any[] = [];

    const START_X = 0;
    const START_Y = 60;
    const NODE_SPACING_X = 200;

    newNodes.push({
      id: "sequential-start",
      type: "startNode",
      position: { x: START_X, y: START_Y },
      data: { label: "sequential-start" },
    });

    agents.forEach((agent: any, index: number) => {
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
          },
        },
      });

      const sourceId =
        index === 0 ? "sequential-start" : `middle-node-${index - 1}`;
      newEdges.push(
        index == 0 || index === agents.length - 1
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
    const outputPosX = START_X + NODE_SPACING_X * (agents.length + 1);
    newNodes.push({
      id: outputNodeId,
      type: "outputNode",
      position: { x: outputPosX, y: START_Y },
      data: { label: "sequential-output" },
    });

    if (agents.length > 0) {
      newEdges.push({
        id: `e${agents.length}`,
        source: `middle-node-${agents.length - 1}`,
        target: outputNodeId,
        targetHandle: "output",
      });
    }
    setNodes(newNodes);
    setEdges(newEdges);
  };

  const handleSaveAgent = (id: string, values: any) => {
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
      buildSequentialNodesAndEdges(response);
      setAgentName(response.name);
    }
  };

  const handleCreateOrUpdateAgent = async () => {
    const agentNodes = nodes.filter((node) => node.data?.fields);

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
        };
      }
    });

    const agentic = {
      name: agentName,
      type: "sequential",
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
          <SequentialAgentCanvas
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

export default SequentialAgentForm;
