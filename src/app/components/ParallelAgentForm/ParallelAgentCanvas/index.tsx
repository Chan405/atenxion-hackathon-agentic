"use client";
import React, { useCallback } from "react";
import {
  addEdge,
  Background,
  Controls,
  ReactFlow,
  ReactFlowProvider,
  useEdgesState,
  useNodesState,
} from "@xyflow/react";

import "@xyflow/react/dist/style.css";
import StartNode from "../../CustomNodes/Start";
import OutputNode from "../../CustomNodes/Output";
import AgentNode from "../../CustomNodes/Agent";

const Canvas = () => {
  const initialNodes = [
    {
      id: "parallel-start",
      type: "startNode",
      position: { x: 0, y: 0 },
      data: { label: "parallel-start" },
    },
    {
      id: "middle-node",
      type: "middleNode",
      position: { x: 170, y: 0 },
      data: {
        fields: {
          name: "Agent 1",
          model: "",
          instruction: "",
          temperature: 0.5,
          topP: 10,
          tools: [],
          maxOutputToken: 100,
        },
      },
    },
    {
      id: "parallel-output",
      type: "outputNode",
      position: { x: 340, y: 0 },
      data: { label: "parallel-start" },
    },
  ];

  const nodeTypes = {
    startNode: StartNode,
    outputNode: OutputNode,
    middleNode: AgentNode,
  };

  const initialEdges = [
    { id: "e1", source: "parallel-start", target: "middle-node" },
    { id: "e2", source: "middle-node", target: "parallel-output" },
  ];

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (param: any) => setEdges((eds) => addEdge(param, eds)),
    [setEdges]
  );
  return (
    <ReactFlow
      nodes={nodes}
      nodeTypes={nodeTypes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
    >
      <Controls />
      {/* <Background variant="dots" gap={12} size={1} /> */}
    </ReactFlow>
  );
};

export const ParallelAgentCanvas = () => (
  <ReactFlowProvider>
    <Canvas />
  </ReactFlowProvider>
);
