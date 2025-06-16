/* eslint-disable @typescript-eslint/no-explicit-any */
import { Box } from "@mui/material";
import { Handle, Position } from "@xyflow/react";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import React, { useState } from "react";
import BodyText from "../../Typeface/BodyText";
import DeleteIcon from "@mui/icons-material/Delete";

const AgentNode = ({ data }: any) => {
  const [showDeleteIcon, setShowDeleteIcon] = useState<boolean>(false);
  return (
    <Box
      sx={{
        height: "70px",
        backgroundColor: "#fff",
        borderRadius: "8px",
        border: "2px solid #4dd0e1",
        display: "flex",
        justifyContent: "start",
        alignItems: "center",
        gap: 1,
        px: 4,
        position: "relative",
      }}
      onDoubleClick={data.onDoubleClick}
      onMouseEnter={() => setShowDeleteIcon(true)}
      onMouseLeave={() => setShowDeleteIcon(false)}
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
          {data.fields.name === "gemini-2.5-flash-preview-04-17"
            ? "Gemini"
            : data.fields.name}
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
          {data.fields.model || ""}
        </BodyText>
      </Box>
      <Handle type="source" position={Position.Right} id={"right"} />
      <Handle type="target" position={Position.Left} id={"left"} />
    </Box>
  );
};

export default AgentNode;
