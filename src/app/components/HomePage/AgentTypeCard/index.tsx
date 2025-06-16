import { Box } from "@mui/material";
import React from "react";
import HeadingH3 from "../../Typeface/HeadingH3";
import BodyText from "../../Typeface/BodyText";
import Image from "next/image";

interface CardProps {
  type: string;
  selected: boolean;
  description: string;
  img: string;
}

function AgentTypeCard({ type, selected, description, img }: CardProps) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "start",
        width: "400px",
        height: "200px",
        border: !selected ? "2px solid #314675" : "2px solid #aaa",
        borderRadius: "12px",
        px: 2,
        gap: 1,
        cursor: "pointer",
        color: "#fff",
        // bgcolor: "#21386e",
        bgcolor: "#374c7c",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          mb: 1,
          width: "100%",
        }}
      >
        <Image src={img} alt="type" width={50} height={50} />{" "}
      </Box>
      <HeadingH3>{type}</HeadingH3>
      <BodyText variant="medium" color="#fff">
        {" "}
        {description}
      </BodyText>
    </Box>
  );
}

export default AgentTypeCard;
