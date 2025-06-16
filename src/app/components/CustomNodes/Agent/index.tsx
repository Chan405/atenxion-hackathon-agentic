// components/CustomFormNode.tsx
import { Box, Typography } from "@mui/material";
import { Handle, Position } from "@xyflow/react";
import React from "react";

const AgentNode = ({ data }: any) => {
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
      onClick={data.onClick}
    >
      <Typography
        sx={{
          fontSize: "18px",
          borderBottom: "1px solid #E0E0E0",
          textAlign: "center",
          padding: "2px",
          borderRadius: "8px 8px 0 0",
        }}
      >
        {data.fields.name || ""}
      </Typography>
      <Handle type="source" position={Position.Right} />
      <Handle type="target" position={Position.Left} />
    </Box>
  );
};

export default AgentNode;
