/* eslint-disable @typescript-eslint/no-explicit-any */
import { Box, Tooltip } from "@mui/material";
import { Handle, Position } from "@xyflow/react";
import RocketLaunchIcon from "@mui/icons-material/RocketLaunch";
import React from "react";
import BodyText from "../../Typeface/BodyText";
import Image from "next/image";

const AgentNode = ({ data}: any) => {
    const isActive =
  String(data.fields.name).trim() === String(data.activeAgentId).trim();// Check if the agent is active based on the name matching the activeAgentId
    // const isActive=true;
// console.log("data.fields.name:", JSON.stringify(data.fields.name));
// console.log("data.activeAgentId:", JSON.stringify(data.activeAgentId));
// console.log("Equal?", data.fields.name === data.activeAgentId);

// console.log('isActive', isActive, data.fields.name, data.activeAgentId);#
  return (
    <Tooltip
      title={
        <Box
          sx={{
            p: 1.2,
            borderRadius: "8px",
            fontSize: "13px",
            minWidth: 20,
            maxHeight: 200,
            overflowY: "auto",
          }}
        >
          <Box sx={{ mb: 0.5 }}>
            <strong>Agent Name:</strong> {data.fields.name || "Unnamed Agent"}
          </Box>
          <Box sx={{ mb: 0.5 }}>
            <strong>Model:</strong> {data.fields.model || "No model selected"}
          </Box>
          <Box>
            <strong>Instruction:</strong>{" "}
            {data.fields.instruction?.trim() || "No instruction provided"}
          </Box>
        </Box>
      }
      arrow
    >
      <Box
        sx={{
          width: 200,
          backgroundColor: "rgb(223, 248, 255)",
          borderRadius: "12px",
          border: isActive ? "2px solid #4dd0e1" : "1px solid black" , 
          overflow: "hidden",
          fontFamily: "sans-serif",
           position: "relative",
          // Glow effect when active
          ...(isActive && {
            boxShadow: "0 0 10px 3px rgba(77, 208, 225, 0.7)",
            animation: "pulse 1.5s infinite",
          }),
          "@keyframes pulse": {
            "0%": {
              boxShadow: "0 0 5px 2px rgba(77, 208, 225, 0.5)",
            },
            "50%": {
              boxShadow: "0 0 15px 5px rgba(77, 208, 225, 0.9)",
            },
            "100%": {
              boxShadow: "0 0 5px 2px rgba(77, 208, 225, 0.5)",
            },
          },
        }}
        onDoubleClick={data.onDoubleClick}
      >
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            px: 1.5,
            py: 1,
            borderBottom: "1px solid #4dd0e1",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <RocketLaunchIcon sx={{ fontSize: 18 }} color="info" />
            <BodyText variant="medium" weight="semibold" whiteSpace="nowrap">
              {data.fields.name || ""}
            </BodyText>
          </Box>
        </Box>

        {/* Body */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            gap: 1,
            py: 0.5,
          }}
        >
          <Box sx={{ p: 1.5 }}>
            <BodyText
              variant="small"
              weight="semibold"
              whiteSpace={"nowrap"}
              borderRadius={"12px"}
            >
              {data.fields.model.includes("gemini")
                ? "Gemini"
                : data.fields.model}
            </BodyText>
          </Box>

          {data.fields.tools.map((tool: any, index: number) => (
            <Box key={index}>
              {tool === "WebSearch" ? (
                <Image
                  src="/assets/websearch.png"
                  alt="Web Search"
                  width={16}
                  height={16}
                />
              ) : tool === "CodeInterpreter" ? (
                <Image
                  src="/assets/code.png"
                  alt="Code Interpreter"
                  width={16}
                  height={16}
                />
              ) : tool === "MCPLine" ? (
                <Image
                  src="/assets/line.png"
                  alt="MCP Line"
                  width={16}
                  height={16}
                />
              ) : (
                <Image
                  src="/assets/Atenxion_Logo.svg"
                  alt="File Upload"
                  width={16}
                  height={16}
                />
              )}
            </Box>
          ))}
        </Box>

        <Handle
          type="source"
          position={Position.Right}
          id="right"
          style={{
            background: "#4dd0e1", // Cyan color
            width: "1px", // Width of rectangle
            height: "18px", // Height of rectangle
            borderRadius: "0", // Remove rounded corners for sharp rectangle
            transform: "translateY(-10px)", // Center vertically
          }}
        />

        <Handle
          type="target"
          position={Position.Left}
          id="left"
          style={{
            background: "#4dd0e1", // Cyan color
            width: "1px", // Width of rectangle
            height: "18px", // Height of rectangle
            borderRadius: "0", // Remove rounded corners
            transform: "translateY(-15px)", // Center vertically
          }}
        />
      </Box>
    </Tooltip>
  );
};

export default AgentNode;
