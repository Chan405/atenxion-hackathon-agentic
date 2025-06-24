/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React from "react";
import { ReactFlow, ReactFlowProvider, Controls } from "@xyflow/react";

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
}
const Canvas = ({
  nodes,
  edges,

  onNodesChange,
  onEdgesChange,
  onConnect,
  handleNodeDoubleClick,
}: CanvasProps) => {
  return (
    <Box sx={{ position: "relative", width: "100%", height: "100%" }}>
      {/* <Box
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
      </Box> */}

      <ReactFlow
        nodes={nodes}
        nodeTypes={nodeTypes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        // edgeTypes={edgeTypes}
        onNodeDoubleClick={(_, node) => handleNodeDoubleClick(node)}
      >
        <Controls />
      </ReactFlow>
    </Box>
  );
};

export const LLMDrivenAgentCanvas = ({
  nodes,
  edges,
  addAgentNode,
  onNodesChange,
  onEdgesChange,
  onConnect,
  handleNodeDoubleClick,
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
    />
  </ReactFlowProvider>
);
