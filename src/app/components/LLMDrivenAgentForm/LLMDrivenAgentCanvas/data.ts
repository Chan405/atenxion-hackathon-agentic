import AgentNode from "../../CustomNodes/Agent";
import OutputNode from "../../CustomNodes/Output";
import StartNode from "../../CustomNodes/Start";

export const initialNodes = [
  {
    id: "sequential-start",
    type: "startNode",
    position: { x: 0, y: 60 },
    data: { label: "sequential-start" },
  },
  {
    id: "middle-node",
    type: "middleNode",
    position: { x: 160, y: 60 },
    data: {
      fields: {
        name: "Agent 0",
        model: "gpt-4.1",
        instruction: "",
        temperature: 0.7,
        topP: 1.0,
        tools: [],
        maxOutputToken: 16000,
        description: "",
        outputKeys: [],
      },
    },
  },
  {
    id: "sequential-output",
    type: "outputNode",
    position: { x: 360, y: 60 },
    data: { label: "sequential-output" },
  },
];

export const nodeTypes = {
  startNode: StartNode,
  outputNode: OutputNode,
  middleNode: AgentNode,
};

export const initialEdges = [
  { id: "e1", source: "sequential-start", target: "middle-node" },
  {
    id: "e2",
    source: "middle-node",
    target: "sequential-output",
    targetHandle: "output",
  },
];
