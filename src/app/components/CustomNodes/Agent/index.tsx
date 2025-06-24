/* eslint-disable @typescript-eslint/no-explicit-any */
import { Box, Tooltip, Typography } from "@mui/material";
import { Handle, Position } from "@xyflow/react";
import RocketLaunchIcon from "@mui/icons-material/RocketLaunch";
import React from "react";
import BodyText from "../../Typeface/BodyText";
import Image from "next/image";
import { guardrailsList, toolLists } from "../../Common/AgentCreateModal";

const AgentNode = ({ data }: any) => {
  return (
    <Tooltip
      title={
        <Box
          sx={{
            p: 1.2,
            borderRadius: "8px",
            fontSize: "13px",
            minWidth: 20,
            maxHeight: 200,
            overflowY: "auto",
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
          width: 200,
          backgroundColor: "rgb(223, 248, 255)",
          borderRadius: "12px",
          border: "2px solid #4dd0e1",
          overflow: "hidden",
          fontFamily: "sans-serif",
        }}
        onDoubleClick={data.onDoubleClick}
      >
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            px: 1.5,
            py: 1,
            borderBottom: "1px solid #4dd0e1",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <RocketLaunchIcon sx={{ fontSize: 18 }} color="info" />
            <BodyText variant="medium" weight="semibold" whiteSpace="nowrap">
              {data.fields.name || ""}
            </BodyText>
          </Box>
        </Box>

        {/* Body */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            gap: 1,
            py: 0.5,
          }}
        >
          <Box sx={{ p: 1.5 }}>
            <BodyText
              variant="small"
              weight="semibold"
              whiteSpace={"nowrap"}
              borderRadius={"12px"}
            >
              {data.fields.model.includes("gemini")
                ? "Gemini"
                : data.fields.model}
            </BodyText>
          </Box>

          {data.fields.tools.map((tool: any, index: number) => (
            <Box key={index}>
              {toolLists.map((item) => {
                if (item.value === tool) {
                  return (
                    <Image
                      key={item.value}
                      src={item.image}
                      alt={item.label}
                      width={16}
                      height={16}
                    />
                  );
                }
                return null;
              })}
            </Box>
          ))}
        </Box>

        {data.fields.guardrails.length > 0 && (
          <Box
            px={1.5}
            display="flex"
            flexDirection="row"
            gap={1}
            py={1}
            sx={{
              borderTop: "1px solid #4dd0e1",
            }}
          >
            <Typography>
              <BodyText variant="small" weight="semibold">
                Guardrails
              </BodyText>
            </Typography>
            <Box
              display="flex"
              flexDirection="row"
              alignItems="center"
              justifyContent="center"
              gap={1}
            >
              {data.fields.guardrails.map((guardrail: any, index: number) => (
                <Box key={index}>
                  {guardrailsList.map((item) => {
                    if (item.value === guardrail) {
                      return (
                        <Image
                          key={item.value}
                          src={item.image}
                          alt={item.label}
                          width={16}
                          height={16}
                        />
                      );
                    }
                    return null;
                  })}
                </Box>
              ))}
            </Box>
          </Box>
        )}

        <Handle
          type="source"
          position={Position.Right}
          id="right"
          style={{
            background: "#4dd0e1", // Cyan color
            width: "1px", // Width of rectangle
            height: "18px", // Height of rectangle
            borderRadius: "0", // Remove rounded corners for sharp rectangle
            transform: "translateY(-10px)", // Center vertically
          }}
        />

        <Handle
          type="target"
          position={Position.Left}
          id="left"
          style={{
            background: "#4dd0e1", // Cyan color
            width: "1px", // Width of rectangle
            height: "18px", // Height of rectangle
            borderRadius: "0", // Remove rounded corners
            transform: "translateY(-15px)", // Center vertically
          }}
        />
      </Box>
    </Tooltip>
  );
};

export default AgentNode;
