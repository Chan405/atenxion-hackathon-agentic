import AgentNode from "../../CustomNodes/Agent";
import OutputNode from "../../CustomNodes/Output";
import StartNode from "../../CustomNodes/Start";

export const initialNodes = [
  {
    id: "sequential-start",
    type: "startNode",
    position: { x: 0, y: 70 },
    data: { label: "sequential-start" },
  },
  {
    id: "middle-node",
    type: "middleNode",
    position: { x: 170, y: 60 },
    data: {
      fields: {
        name: "Agent 1",
        model: "gpt-4.1",
        instruction: "",
        temperature: 0.5,
        topP: 10,
        tools: [],
        maxOutputToken: 100,
      },
    },
  },
  {
    id: "sequential-output",
    type: "outputNode",
    position: { x: 420, y: 70 },
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
  { id: "e2", source: "middle-node", target: "sequential-output" },
];
