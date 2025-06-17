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
        width: "450px",
        height: "250px",
        border: !selected ? "3px solid  #C1e8ff" : "3px solid #5483b1",
        borderRadius: "12px",
        px: 2,
        gap: 1,
        cursor: "pointer",
        color: "#fff",
        // bgcolor: "#21386e",
        bgcolor: "#C1e8ff",
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
        <Image src={img} alt="type" width={80} height={80} />{" "}
      </Box>
      <HeadingH3>{type}</HeadingH3>
      <BodyText variant="medium" color="#052659">
        {" "}
        {description}
      </BodyText>
    </Box>
  );
}

export default AgentTypeCard;
