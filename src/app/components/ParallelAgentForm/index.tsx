/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { Box } from "@mui/material";
import React, { useCallback, useState } from "react";
import ButtonComponent from "../Common/ButtonComponent";
import { ParallelAgentCanvas } from "./ParallelAgentCanvas";
import Input from "../Common/Input";
import { addEdge, useEdgesState, useNodesState } from "@xyflow/react";
import {
  AGENT_X,
  AGENT_Y_GAP,
  initialEdges,
  initialNodes,
} from "./ParallelAgentCanvas/data";
import AgentCreateModal from "../Common/AgentCreateModal";
import { createAgentic } from "@/actions/agenticAction";

function ParallelAgentForm() {
  const [agentName, setAgentName] = useState<string>("");

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (param: any) => setEdges((eds) => addEdge(param, eds)),
    [setEdges]
  );

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedNode, setSelectedNode] = useState<any>(null);

  const handleNodeDoubleClick = (node: any) => {
    setSelectedNode(node);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedNode(null);
  };

  const addAgentNode = () => {
    const START_Y = 200;
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
          model: "",
          instruction: "",
          temperature: 0.5,
          topP: 1.0,
          tools: [],
          maxOutputToken: 100,
          description: "",
        },
      },
    };

    const newEdges = [
      ...edges,
      {
        id: `e-start-${newNodeId}`,
        source: "parallel-start",
        target: newNodeId,
      },
      {
        id: `e-${newNodeId}-output`,
        source: newNodeId,
        // target: "parallel-output",
        target: "merge-node",
      },
    ];

    setNodes([...nodes, newNode]);
    setEdges(newEdges);
  };

  const handleSaveAgent = (id: string, values: any) => {
    console.log(values);
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
      type: "parallel",
      agents,
    };
    const response = await createAgentic(agentic);
    console.log(response);
  };

  return (
    <Box>
      <Box
        sx={{ px: 4, py: 2, display: "flex", flexDirection: "column", gap: 2 }}
      >
        <Input
          name="name"
          label="Agent Name"
          value={""}
          placeholder="e.g., Customer Onboarding Flow"
          onChange={(e) => {
            setAgentName(e.target.value);
          }}
          width="40%"
          showLabel
        />
        {/* <ButtonComponent onClick={sendMessage} label="Send" /> */}
        <Box
          sx={{
            height: "500px",
            border: "1px dashed #77696D",
            p: 2,
            borderRadius: "8px",
          }}
        >
          <ParallelAgentCanvas
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            addAgentNode={addAgentNode}
            handleNodeDoubleClick={handleNodeDoubleClick}
          />
        </Box>
        <ButtonComponent
          label="Next"
          onClick={handleCreateOrUpdateAgent}
          width="150px"
          height="40px"
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

export default ParallelAgentForm;
