"use client";
import { Box } from "@mui/material";
import React from "react";
import ButtonComponent from "../Common/ButtonComponent";
import { ParallelAgentCanvas } from "./ParallelAgentCanvas";
import Input from "../Common/Input";
import { chat } from "@/app/service/axiosServer";
// import { chat } from "@/actions/agenticAction";

function ParallelAgentForm() {
  // const sendMessage = async () => {
  //   const res = await chat(
  //     "684ff3a80c5bb5409d9d4250",
  //     "Tell me a short funny story"
  //   );
  //   console.log({ res });
  // };

  return (
    <Box>
      <Box
        sx={{ px: 4, py: 2, display: "flex", flexDirection: "column", gap: 2 }}
      >
        <Input
          name="name"
          label="Agent Name"
          value={""}
          placeholder="e.g., Customer Onboarding Flow"
          onChange={() => {}}
          width="40%"
          showLabel
        />
        {/* <ButtonComponent onClick={sendMessage} label="Send" /> */}
        <Box
          sx={{
            height: "500px",
            border: "1px dashed #77696D",
            p: 2,
            borderRadius: "8px",
          }}
        >
          <ParallelAgentCanvas />
        </Box>
        <ButtonComponent
          label="Next"
          onClick={() => {}}
          width="150px"
          height="40px"
        />
      </Box>
    </Box>
  );
}

export default ParallelAgentForm;
