import { Box } from "@mui/material";
import { Handle, Position } from "@xyflow/react";
import React from "react";
import BodyText from "../../Typeface/BodyText";

function MergeNode() {
  return (
    <Box
      sx={{
        width: "100px",
        height: "50px",
        backgroundColor: "#fff",
        borderRadius: "8px",
        border: "2px solid #4160e6",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: 1,
        px: 4,
      }}
    >
      {/* <PlayCircleFilledWhiteIcon sx={{ color: "#7ee787" }} /> */}
      <BodyText variant="medium" weight="semibold" color="#616161s">
        Merge
      </BodyText>

      <Handle type="source" position={Position.Left} id="left" />

      <Handle type="source" position={Position.Right} id="right" />
    </Box>
  );
}

export default MergeNode;
