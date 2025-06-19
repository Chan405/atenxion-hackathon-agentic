import AgentNode from "../../CustomNodes/Agent";
import OutputNode from "../../CustomNodes/Output";
import StartNode from "../../CustomNodes/Start";

export const initialNodes = [
  {
    id: "llmdriven-start",
    type: "startNode",
    position: { x: 0, y: 160 },
    data: { label: "llmdriven-start" },
  },
  {
    id: "orchestrator",
    type: "middleNode",
    position: { x: 160, y: 160 },
    data: {
      fields: {
        name: "Orchestrator",
        model: "gpt-4.1",
        instruction: "",
        temperature: 0.7,
        topP: 1.0,
        tools: [],
        maxOutputToken: 16000,
        description: "",
        outputKeys: [],
        isOrchestrator: true,
        datastore: "",
      },
    },
  },
  {
    id: "llmdriven-output",
    type: "outputNode",
    position: { x: 460, y: 160 },
    data: { label: "llmdriven-output" },
  },
];

export const nodeTypes = {
  startNode: StartNode,
  outputNode: OutputNode,
  middleNode: AgentNode,
};

export const initialEdges = [
  { id: "e1", source: "llmdriven-start", target: "orchestrator" },
  {
    id: "e2",
    source: "orchestrator",
    target: "llmdriven-output",
    targetHandle: "output",
  },
];
