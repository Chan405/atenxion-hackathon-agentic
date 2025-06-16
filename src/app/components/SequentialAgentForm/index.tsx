/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { Box } from "@mui/material";
import React, { useCallback, useState } from "react";
import ButtonComponent from "../Common/ButtonComponent";

import Input from "../Common/Input";
import { SequentialAgentCanvas } from "./SequentialAgentCanvas";
import { addEdge, useEdgesState, useNodesState } from "@xyflow/react";
import { initialEdges, initialNodes } from "./SequentialAgentCanvas/data";
import AgentCreateModal from "../Common/AgentCreateModal";

function SequentialAgentForm() {
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
          temperature: 0.5,
          topP: 10,
          tools: [],
          maxOutputToken: 100,
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
          label="Next"
          onClick={() => {}}
          width="150px"
          height="40px"
        />

        <AgentCreateModal
          open={isModalOpen}
          handleClose={handleModalClose}
          handleSubmit={() => {}}
        />
      </Box>
    </Box>
  );
}

export default SequentialAgentForm;
