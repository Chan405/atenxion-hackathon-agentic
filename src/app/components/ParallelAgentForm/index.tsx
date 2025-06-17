/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { Box } from "@mui/material";
import React, { useCallback, useEffect, useState } from "react";
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
import {
  createAgentic,
  editAgentic,
  getAgenticById,
} from "@/actions/agenticAction";
import { useParams, useRouter } from "next/navigation";
import ResponsePickerPromptModal from "../Common/ResponsePickerPromptModal";

const START_X = 0;
const START_Y = 40;

const OUTPUT_X = 680;

const MERGE_X = 460;
const MERGE_Y = 200;

function ParallelAgentForm() {
  const params = useParams();
  const router = useRouter();

  const [agentName, setAgentName] = useState<string>("");

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (param: any) => setEdges((eds) => addEdge(param, eds)),
    [setEdges]
  );

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPromptModalOpen, setIsPromptModalOpen] = useState(false);

  const [responsePickerPrompt, setResponsePickerPrompt] = useState("");
  const [selectedNode, setSelectedNode] = useState<any>(null);

  const handleNodeDoubleClick = (node: any) => {
    setSelectedNode(node);
    setIsModalOpen(true);
  };

  const handleMergeDoubleClick = (node: any) => {
    setSelectedNode(node);
    console.log(node);
    setIsPromptModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedNode(null);
  };

  const handlePromptChange = (e: any) => {
    setResponsePickerPrompt(e.target.value);
  };

  const addAgentNode = () => {
    const START_Y = 60;
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
          model: "gpt-4.1",
          instruction: "",
          temperature: 0.5,
          topP: 1.0,
          tools: [],
          maxOutputToken: 100,
          description: "",
          outputKeys: [],
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

  const buildNodesAndEdges = (agentValue: any) => {
    const agents = agentValue?.agents || [];

    // Start with Start and Output Nodes
    const newNodes: any[] = [
      {
        id: "parallel-start",
        type: "startNode",
        position: { x: START_X, y: START_Y },
        data: { label: "Start" },
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

    const newEdges: any[] = [];

    agents.forEach((agent: any, index: number) => {
      const agentId = `middle-node-${index}`;
      const posY = START_Y + index * 150; // offset each agent vertically

      // Add middle (agent) node
      newNodes.push({
        id: agentId,
        type: "middleNode",
        position: { x: AGENT_X, y: posY },
        data: {
          fields: {
            name: agent.name,
            model: agent.chatmodel,
            instruction: agent.instruction || "",
            temperature: parseFloat(agent.temperature),
            topP: parseFloat(agent.topP),
            tools: agent.tools || [],
            maxOutputToken: parseInt(agent.maxTokens),
            description: agent.description || "",
            outputKeys: agent.outputKeys || "",
          },
        },
      });

      // Connect start -> agent -> merge
      newEdges.push(
        { id: `e-start-${index}`, source: "parallel-start", target: agentId },
        { id: `e-merge-${index}`, source: agentId, target: "merge-node" }
      );
    });

    // Final connection to output
    newEdges.push({
      id: "e-output",
      source: "merge-node",
      target: "parallel-output",
    });

    setNodes(newNodes);
    setEdges(newEdges);
  };

  // api integration
  const getAgentByID = async () => {
    const response = await getAgenticById(params.id as string);
    if (response) {
      // setAgentValue(response);
      buildNodesAndEdges(response);
      setAgentName(response.name);
      setResponsePickerPrompt(response.responsePickerPrompt);
    }
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
          outputKeys: fields.outputKeys,
        };
      }
    });

    const agentic = {
      name: agentName,
      responsePickerPrompt,
      type: "parallel",
      agents,
    };

    // console.log(agentic);

    let response;

    if (params.id) {
      response = await editAgentic(params.id as string, agentic);
    } else {
      response = await createAgentic(agentic);
    }

    // const response = await createAgentic(agentic);
    console.log(response);
  };

  useEffect(() => {
    if (params.id) {
      getAgentByID();
    }
  }, []);

  const handleDeleteNode = useCallback(
    (nodeId: string) => {
      const agentNodes = nodes.filter((node) => node.data?.fields);
      if (agentNodes.length < 2) return;

      setNodes((nds) => {
        const deletedNode = nds.find((n) => n.id === nodeId);
        const isMiddleNode = deletedNode?.type === "middleNode";

        const updatedNodes = nds.filter((n) => n.id !== nodeId);

        if (!isMiddleNode) return updatedNodes;

        // If we deleted a middle node, update output node position
        const remainingMiddleNodes = updatedNodes
          .filter((n) => n.type === "middleNode")
          .sort((a, b) => a.position.x - b.position.x);

        if (remainingMiddleNodes.length > 0) {
          const lastNode =
            remainingMiddleNodes[remainingMiddleNodes.length - 1];
          return updatedNodes.map((n) =>
            n.id === "sequential-output"
              ? {
                  ...n,
                  position: {
                    x: lastNode.position.x + 200,
                    y: lastNode.position.y,
                  },
                }
              : n
          );
        }

        return updatedNodes;
      });

      setEdges((eds) => {
        // Remove any edge connected to the deleted node
        let filteredEdges = eds.filter(
          (e) => e.source !== nodeId && e.target !== nodeId
        );

        // If a middle node was deleted, reconnect the last one to output
        const remainingMiddleNodes = nodes
          .filter((n) => n.id !== nodeId && n.type === "middleNode")
          .sort((a, b) => a.position.x - b.position.x);

        if (remainingMiddleNodes.length > 0) {
          const lastNode =
            remainingMiddleNodes[remainingMiddleNodes.length - 1];

          // Remove any existing edge from last middle node to output to prevent duplicates
          filteredEdges = filteredEdges.filter(
            (e) =>
              !(e.source === lastNode.id && e.target === "sequential-output")
          );

          // Add the edge from last remaining middle node to output
          filteredEdges.push({
            id: `e-${lastNode.id}-sequential-output`,
            source: lastNode.id,
            target: "sequential-output",
          });
        }

        return filteredEdges;
      });

      setSelectedNode(null);
      setIsModalOpen(false);
    },
    [nodes]
  );

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <Box
        sx={{
          width: "800px",
          px: 4,
          py: 2,
          display: "flex",
          flexDirection: "column",
          gap: 2,
          border: "1px dashed #77696D",
          borderRadius: "8px",
          m: 2,
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Input
            name="name"
            label="Agent Name"
            value={agentName}
            placeholder="e.g., Customer Onboarding Flow"
            onChange={(e) => {
              setAgentName(e.target.value);
            }}
            width="100%"
            showLabel
          />

          <ButtonComponent
            label="Add Agent"
            onClick={addAgentNode}
            width="140px"
            height="40px"
          />
        </Box>

        <Box
          sx={{
            height: "400px",
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
            handleMergeDoubleClick={handleMergeDoubleClick}
          />
        </Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <ButtonComponent
            label={"Back"}
            onClick={() => {
              router.push("/");
            }}
            width="150px"
            height="50px"
            color="#eee"
            textColor="#000"
          />
          <ButtonComponent
            label={params.id ? "Update" : "Create"}
            onClick={handleCreateOrUpdateAgent}
            width="150px"
            height="50px"
            disabled={agentName.trim().length === 0}
          />
        </Box>

        {selectedNode && isModalOpen && (
          <AgentCreateModal
            open={isModalOpen}
            handleClose={handleModalClose}
            handleSaveAgent={handleSaveAgent}
            selectedNode={selectedNode}
            removeAgent={handleDeleteNode}
          />
        )}

        {selectedNode &&
          selectedNode.id === "merge-node" &&
          isPromptModalOpen && (
            <ResponsePickerPromptModal
              open={isPromptModalOpen}
              handleClose={() => {
                setSelectedNode(null);
                setIsPromptModalOpen(false);
              }}
              prompt={responsePickerPrompt}
              handleChange={handlePromptChange}
              handleSavePrompt={() => {
                setIsPromptModalOpen(false);
              }}
            />
          )}
      </Box>
    </Box>
  );
}

export default ParallelAgentForm;
