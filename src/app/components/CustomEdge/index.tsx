// components/CustomEdge.tsx
import React from "react";
import { getBezierPath, EdgeProps } from "@xyflow/react";

export const CustomEdge: React.FC<EdgeProps> = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style,
  markerEnd,
  data,
}) => {
  const [edgePath] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const isFinal = data?.isFinal; // Check custom prop

  return (
    <>
      <path
        id={id}
        d={edgePath}
        style={{
          stroke: isFinal ? "#222" : "#999",
          strokeWidth: 2,
          strokeDasharray: isFinal ? "0" : "5,5", // Dotted or solid
          ...style,
        }}
        markerEnd={markerEnd}
      />
    </>
  );
};
