/* eslint-disable @typescript-eslint/no-explicit-any */
import { Box } from "@mui/material";
import { Handle, Position } from "@xyflow/react";
import React from "react";
import BodyText from "../../Typeface/BodyText";
import JoinFullIcon from "@mui/icons-material/JoinFull";
function MergeNode({ data }: any) {
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
      onDoubleClick={data.handleMergeDoubleClick}
    >
      <JoinFullIcon sx={{ color: "#4160e6" }} />
      <BodyText variant="medium" weight="semibold" color="#616161s">
        Merge
      </BodyText>

      <Handle type="target" position={Position.Left} id="left" />

      <Handle type="source" position={Position.Right} id="right" />
    </Box>
  );
}

export default MergeNode;
