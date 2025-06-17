/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { Box } from "@mui/material";
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
import { chat } from "@/app/service/chatService";
import { useParams } from "next/navigation";

function SequentialAgentForm() {
  const params = useParams();

  const [agentName, setAgentName] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedNode, setSelectedNode] = useState<any>(null);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

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
    const newX = lastAgent.position.x + 210;

    const newNode = {
      id: newNodeId,
      type: "middleNode",
      position: { x: newX, y: lastAgent.position.y },
      data: {
        fields: {
          name: `Agent ${agentNodes.length + 1}`,
          model: "",
          instruction: "",
          temperature: 0.7,
          topP: 1,
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

    setNodes([...updatedNodes, newNode]);
    setEdges(filteredEdges);
  };

  const handleDeleteNode = useCallback((nodeId: string) => {
    setNodes((nds) => nds.filter((n) => n.id !== nodeId));
    setEdges((eds) =>
      eds.filter((e) => e.source !== nodeId && e.target !== nodeId)
    );
  }, []);

  const buildSequentialNodesAndEdges = (agentValue: any) => {
    const agents = agentValue?.agents || [];

    const newNodes: any[] = [];
    const newEdges: any[] = [];

    const START_X = 0;
    const START_Y = 70;
    const NODE_SPACING_X = 240;

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
        position: { x: posX, y: START_Y - 10 },
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
    console.log(newEdges);
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
      response = await editAgentic(params.id as string, agentic);
    } else {
      response = await createAgentic(agentic);
    }
    console.log(response);
  };

  useEffect(() => {
    if (params.id) {
      getAgentByID();
    }
  }, []);

  const sendMsg = async () => {
    const res = await chat(
      "6850b4b11db8349f0756bc0c",
      "tell me a horror story"
    );
    console.log("res", res);
  };
  return (
    <Box>
      <Box
        sx={{ px: 4, py: 2, display: "flex", flexDirection: "column", gap: 2 }}
      >
        <Input
          name="name"
          label="Agent Name"
          value={agentName}
          placeholder="e.g., Customer Onboarding Flow"
          onChange={(e) => {
            setAgentName(e.target.value);
          }}
          width="40%"
          showLabel
        />
        <Box
          sx={{
            height: "500px",
            border: "1px dashed #77696D",
            p: 2,
            borderRadius: "8px",
          }}
        >
          <ButtonComponent label="ask" onClick={sendMsg} />
          <SequentialAgentCanvas
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            addAgentNode={addAgentNode}
            handleNodeDoubleClick={handleNodeDoubleClick}
            handleDeleteNode={handleDeleteNode}
          />
        </Box>
        <ButtonComponent
          label={params.id ? "Update" : "Create"}
          onClick={handleCreateOrUpdateAgent}
          width="150px"
          height="50px"
        />

        {selectedNode && (
          <AgentCreateModal
            open={isModalOpen}
            handleClose={handleModalClose}
            handleSaveAgent={handleSaveAgent}
            selectedNode={selectedNode}
          />
        )}
      </Box>
    </Box>
  );
}

export default SequentialAgentForm;
