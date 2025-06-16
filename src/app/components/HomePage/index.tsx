"use client";
import { Box } from "@mui/material";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import AgentTypeCard from "./AgentTypeCard";
import ButtonComponent from "../Common/ButtonComponent";

function HomePage() {
  const router = useRouter();

  const [agentType, setAgentType] = useState<number | null>(null);

  const handleRoute = () => {
    const route =
      agentType === 0 ? "/create-sequential-agent" : "/create-parallel-agent";
    router.push(route);
  };
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        bgcolor: "#21386e",
        // bgcolor: "#374c7c",
      }}
    >
      <Box>
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
            height="40px"
          />
        </Box>
      </Box>
    </Box>
  );
}

export default HomePage;
