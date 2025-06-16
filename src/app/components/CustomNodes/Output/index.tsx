import { Box, Typography } from "@mui/material";
import { Handle, Position } from "@xyflow/react";
import React from "react";
import ChatBubbleIcon from "@mui/icons-material/ChatBubble";
import BodyText from "../../Typeface/BodyText";

function OutputNode() {
  return (
    <Box
      sx={{
        width: "100px",
        height: "50px",
        backgroundColor: "#fff",
        borderRadius: "8px",
        border: "2px solid #4ddbbb",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: 1,
        px: 4,
      }}
    >
      <ChatBubbleIcon sx={{ color: "#4ddbbb" }} />
      <BodyText variant="medium" weight="semibold" color="#616161s">
        Chat
      </BodyText>

      <Handle type="target" position={Position.Left} id="output" />
    </Box>
  );
}

export default OutputNode;
