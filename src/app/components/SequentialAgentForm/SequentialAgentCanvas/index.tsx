/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React from "react";
import { Controls, ReactFlow, ReactFlowProvider } from "@xyflow/react";

import "@xyflow/react/dist/style.css";

import { Box } from "@mui/material";
import { nodeTypes } from "./data";
import ButtonComponent from "../../Common/ButtonComponent";

interface CanvasProps {
  nodes: any[];
  edges: any[];
  addAgentNode: () => void;
  onNodesChange: any;
  onEdgesChange: any;
  onConnect: any;
  handleNodeDoubleClick: (node: any) => void;
  handleDeleteNode: (node: any) => void;
}
const Canvas = ({
  nodes,
  edges,
  addAgentNode,
  onNodesChange,
  onEdgesChange,
  onConnect,
  handleNodeDoubleClick,
  handleDeleteNode,
}: CanvasProps) => {
  return (
    <Box sx={{ position: "relative", width: "100%", height: "100%" }}>
      <Box
        sx={{
          position: "absolute",
          top: 6,
          left: 2,
          zIndex: 10,
        }}
      >
        <ButtonComponent
          label="Add Agent"
          onClick={addAgentNode}
          width="140px"
        />
      </Box>

      <ReactFlow
        nodes={nodes}
        nodeTypes={nodeTypes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeDoubleClick={(_, node) => handleNodeDoubleClick(node)}
        onNodeMouseEnter={(_, node) => handleDeleteNode(node)}
      >
        <Controls />

        {/* <AgentCreateModal
          open={isModalOpen}
          handleClose={handleModalClose}
          handleSubmit={() => {}}
        /> */}
        {/* <Background variant="dots" gap={12} size={1} /> */}
      </ReactFlow>
    </Box>
  );
};

export const SequentialAgentCanvas = ({
  nodes,
  edges,
  addAgentNode,
  onNodesChange,
  onEdgesChange,
  onConnect,
  handleNodeDoubleClick,
  handleDeleteNode,
}: CanvasProps) => (
  <ReactFlowProvider>
    <Canvas
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      addAgentNode={addAgentNode}
      handleNodeDoubleClick={handleNodeDoubleClick}
      handleDeleteNode={handleDeleteNode}
    />
  </ReactFlowProvider>
);
