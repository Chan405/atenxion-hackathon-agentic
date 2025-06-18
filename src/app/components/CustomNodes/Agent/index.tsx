/* eslint-disable @typescript-eslint/no-explicit-any */
import { Box, Tooltip } from "@mui/material";
import { Handle, Position } from "@xyflow/react";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import React from "react";
import BodyText from "../../Typeface/BodyText";
import Image from "next/image";

const AgentNode = ({ data }: any) => {
  console.log("AgentNode data:", data);
  return (
      <Tooltip title={data.fields.description || data.fields.name || "Agent Node"}>
    <Box
      sx={{
        height: "50px",
        backgroundColor: "#fff",
        borderRadius: "8px",
        border: "2px solid #4dd0e1",
        display: "flex",
        justifyContent: "start",
        alignItems: "center",
        gap: 1,
        px: 2,
        py: data.fields.tools.length > 0 ? 2 : 0,
        position: "relative",
      }}
      onDoubleClick={data.onDoubleClick}
    >
      {/* {showDeleteIcon && (
        <DeleteIcon
          style={{
            position: "absolute",
            top: -28,
            right: "45%",
            fontSize: "22px",
            color: "#aaa",
            zIndex: 999,
            pointerEvents: "auto",
          }}
          onClick={(e) => {
            e.stopPropagation();
            data.handleDeleteNode?.();
          }}
        />
      )} */}
      <SupportAgentIcon sx={{ color: "#4dd0e1" }} />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "start",
          gap: 0.4,
        }}
      >
        {" "}
        <BodyText
          variant="medium"
          weight="semibold"
          color="#616161s"
          whiteSpace={"nowrap"}
        >
          {data.fields.name || ""}
        </BodyText>
        <BodyText
          variant="small"
          weight="semibold"
          color="#fff"
          whiteSpace={"nowrap"}
          bgcolor={"#4dd0e1"}
          borderRadius={"12px"}
          px={2}
        >
          {data.fields.model.includes("gemini") ? "Gemini" : data.fields.model}
        </BodyText>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: 1,
            py: 0.5,
          }}
        >
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
                  src="/assets/711284.png"
                  alt="Code Interpreter"
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
      </Box>
      <Handle type="source" position={Position.Right} id={"right"} />
      <Handle type="target" position={Position.Left} id={"left"} />
    </Box>
    </Tooltip>
  );
};

export default AgentNode;
