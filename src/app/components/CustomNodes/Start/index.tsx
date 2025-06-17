import { Box } from "@mui/material";
import { Handle, Position } from "@xyflow/react";
import React from "react";
import PlayCircleFilledWhiteIcon from "@mui/icons-material/PlayCircleFilledWhite";
import BodyText from "../../Typeface/BodyText";

function StartNode() {
  return (
    <Box
      sx={{
        height: "50px",
        backgroundColor: "#fff",
        borderRadius: "8px",
        border: "2px solid #7ee787",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: 1,
        px: 2,
      }}
    >
      <PlayCircleFilledWhiteIcon sx={{ color: "#7ee787" }} />
      <BodyText variant="medium" weight="semibold" color="#616161s">
        Start
      </BodyText>

      <Handle type="source" position={Position.Right} id="right" />
    </Box>
  );
}

export default StartNode;
