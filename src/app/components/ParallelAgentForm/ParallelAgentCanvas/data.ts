import AgentNode from "../../CustomNodes/Agent";
import MergeNode from "../../CustomNodes/Merge";
import OutputNode from "../../CustomNodes/Output";
import StartNode from "../../CustomNodes/Start";

const START_X = 0;
const START_Y = 200;

export const AGENT_X = 230;
export const AGENT_Y_GAP = 120;

const OUTPUT_X = 680;

const MERGE_X = 460; // between agents and output
const MERGE_Y = 200;

export const initialNodes = [
  {
    id: "parallel-start",
    type: "startNode",
    position: { x: START_X, y: START_Y },
    data: { label: "Start" },
  },
  {
    id: "middle-node-1",
    type: "middleNode",
    position: { x: AGENT_X, y: START_Y - 10 },
    data: {
      fields: {
        name: "Agent 1",
        model: "",
        instruction: "",
        temperature: 0.5,
        topP: 10,
        tools: [],
        maxOutputToken: 100,
        description: "",
      },
    },
  },
  {
    id: "merge-node",
    type: "mergeNode",
    position: { x: MERGE_X, y: MERGE_Y },
    data: { label: "Merge" },
  },
  {
    id: "parallel-output",
    type: "outputNode",
    position: { x: OUTPUT_X, y: START_Y },
    data: { label: "Output" },
  },
];

export const nodeTypes = {
  startNode: StartNode,
  outputNode: OutputNode,
  middleNode: AgentNode,
  mergeNode: MergeNode,
};

export const initialEdges = [
  { id: "e1", source: "parallel-start", target: "middle-node-1" },
  { id: "e2", source: "middle-node-1", target: "merge-node" },
  { id: "e3", source: "merge-node", target: "parallel-output" },
];
