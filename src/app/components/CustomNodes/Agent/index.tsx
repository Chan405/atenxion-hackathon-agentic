/* eslint-disable @typescript-eslint/no-explicit-any */
import { Box, Tooltip } from "@mui/material";
import { Handle, Position } from "@xyflow/react";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import React from "react";
import BodyText from "../../Typeface/BodyText";

const AgentNode = ({ data }: any) => {
  return (
    <Tooltip
      title={
        <Box
          sx={{
            p: 1.2,
            borderRadius: "8px",
            fontSize: "13px",
            minWidth: 200,
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
          height: "50px",
          backgroundColor: "#fff",
          borderRadius: "8px",
          border: "2px solid #4dd0e1",
          display: "flex",
          justifyContent: "start",
          alignItems: "center",
          gap: 1,
          px: 2,
          position: "relative",
        }}
        onDoubleClick={data.onDoubleClick}
      >
        <SupportAgentIcon sx={{ color: "#4dd0e1" }} />
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "start",
            gap: 0.4,
          }}
        >
          <BodyText
            variant="medium"
            weight="semibold"
            color="#616161"
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
            {data.fields.model.includes("gemini")
              ? "Gemini"
              : data.fields.model}
          </BodyText>
        </Box>
        <Handle type="source" position={Position.Right} id={"right"} />
        <Handle type="target" position={Position.Left} id={"left"} />
      </Box>
    </Tooltip>
  );
};

export default AgentNode;
