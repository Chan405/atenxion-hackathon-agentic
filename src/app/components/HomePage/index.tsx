"use client";
import { Box, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import AgentTypeCard from "./AgentTypeCard";
import ButtonComponent from "../Common/ButtonComponent";

function HomePage() {
  const router = useRouter();

  const [agentType, setAgentType] = useState<number | null>(null);

  const handleRoute = () => {
    const route = agentType === 0 ? "/sequential-agent" : "/parallel-agent";
    router.push(route);
  };
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        bgcolor: "#052659",
        // bgcolor: "#374c7c",
      }}
    >
      <Box>
        <Typography
          textAlign="center"
          variant="h2"
          component="h1"
          color="#C1e8ff"
          mb={2}
          sx={{
            fontWeight: "bold",
            fontSize: {
              xs: "2rem",
              sm: "2rem",
              md: "3rem",
            },
          }}

          // fontSize={{ xl: "28px", lg: "24px", xs: "22px" }}
          // fontWeight="bold"
        >
          Atenxion Multi Agent
        </Typography>
        <Box sx={{ display: "flex", justifyContent: "center", gap: 2 }}>
          <Box onClick={() => setAgentType(0)} mb={3}>
            <AgentTypeCard
              type="Sequential Agent"
              description="Agents execute in a fixed sequence, one after another."
              selected={agentType === 0}
              img="/assets/sequential.png"
            />
          </Box>
          <Box onClick={() => setAgentType(1)} mb={3}>
            <AgentTypeCard
              type="Parallel Agent"
              description="Agents run concurrently on the same input, results are aggregated."
              selected={agentType === 1}
              img="/assets/parallel.png"
            />
          </Box>
        </Box>

        <Box sx={{ display: "flex", justifyContent: "end" }}>
          <ButtonComponent
            label="Next"
            onClick={handleRoute}
            width="150px"
            height="50px"
            color="#C1e8ff"
            textColor="#052659"
          />
        </Box>
      </Box>
    </Box>
  );
}

export default HomePage;
