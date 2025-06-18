/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React from "react";
import { Controls, ReactFlow, ReactFlowProvider } from "@xyflow/react";

import "@xyflow/react/dist/style.css";

import { Box } from "@mui/material";
import { nodeTypes } from "./data";

interface CanvasProps {
  nodes: any[];
  edges: any[];
  addAgentNode: () => void;
  onNodesChange: any;
  onEdgesChange: any;
  onConnect: any;
  handleNodeDoubleClick: (node: any) => void;
  handleDeleteNode?: (node: any) => void;
  handleMergeDoubleClick: (node: any) => void;
}

const Canvas = ({
  nodes,
  edges,

  onNodesChange,
  onEdgesChange,
  onConnect,
  handleNodeDoubleClick,
  handleMergeDoubleClick,
}: CanvasProps) => {
  return (
    <Box sx={{ position: "relative", width: "100%", height: "100%" }}>
      <ReactFlow
        nodes={nodes.map((n) => ({
          ...n,
          data: {
            ...n.data,
            onDoubleClick: () => handleNodeDoubleClick(n),
            handleMergeDoubleClick: () => handleMergeDoubleClick(n),
          },
        }))}
        nodeTypes={nodeTypes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
      >
        <Controls />
      </ReactFlow>
    </Box>
  );
};

export const ParallelAgentCanvas = ({
  nodes,
  edges,
  addAgentNode,
  onNodesChange,
  onEdgesChange,
  onConnect,
  handleNodeDoubleClick,
  handleDeleteNode,
  handleMergeDoubleClick,
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
      handleMergeDoubleClick={handleMergeDoubleClick}
    />
  </ReactFlowProvider>
);
