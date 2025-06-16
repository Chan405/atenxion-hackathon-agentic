import { Box, Typography } from "@mui/material";
import { Handle, Position } from "@xyflow/react";
import React from "react";
import ChatBubbleIcon from "@mui/icons-material/ChatBubble";

function OutputNode() {
  return (
    <Box
      sx={{
        width: "100px",
        height: "50px",
        backgroundColor: "#fff",
        borderRadius: "8px",
        border: "1px solid #E0E0E0",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        px: 4,
      }}
    >
      <ChatBubbleIcon />
      <Typography
        sx={{
          fontSize: "18px",
          borderBottom: "1px solid #E0E0E0",
          textAlign: "center",
          padding: "2px",
          borderRadius: "8px 8px 0 0",
        }}
      >
        Chat
      </Typography>

      <Handle type="source" position={Position.Left} id="left" />
    </Box>
  );
}

export default OutputNode;
