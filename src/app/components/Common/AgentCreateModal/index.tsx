import React from "react";
import ModalContainer from "../Modal";
import Input from "../Input";
import { Box, Typography } from "@mui/material";
import SelectComponent from "../SelectComponent";
import TextArea from "../TextArea";
import BodyText from "../../Typeface/BodyText";

interface ModalProps {
  open: boolean;
  handleClose: () => void;
  handleSubmit: () => void;
}

function AgentCreateModal({ open, handleClose }: ModalProps) {
  const modelLists = [
    { value: "gpt-4.1", label: "GPT 4.1" },
    { value: "gpt-4o", label: "GPT 4o" },
    { value: "gemini-2.5-flash-preview-04-17", label: "Gemini 2.5" },
  ];

  const toolLists = [
    { value: "webSearch", label: "Web Search" },
    { value: "codeInterpreter", label: "Code Interpreter" },
    { value: "rag", label: "Connect to your rag" },
  ];

  return (
    <ModalContainer
      width="550px"
      open={open}
      handleClose={handleClose}
      title={"Configure your agent"}
      cancelBtnText="Cancel"
      confirmBtnText={"Save"}
    >
      <Box
        width={"100%"}
        boxSizing={"border-box"}
        px={1}
        py={2}
        display={"flex"}
        flexDirection={"column"}
        justifyContent={"center"}
        gap={2}
      >
        <Box display={"flex"} alignItems={"center"} width={"100%"} gap={2}>
          <Input
            name="name"
            label="Agent Name"
            value={""}
            placeholder="e.g., Customer Onboarding Flow"
            onChange={() => {}}
            width="100%"
            showLabel
          />
          <Box width={"50%"}>
            <SelectComponent
              label="Model Type"
              name="type"
              value={"gpt-4.1"}
              onChange={() => {}}
              options={modelLists}
            />
          </Box>
        </Box>
        <Box display={"flex"} flexDirection={"column"} gap={1}>
          <BodyText variant="small" weight={"medium"}>
            Description
          </BodyText>
          <TextArea value={""} name="Description" height="80px" />
        </Box>
        <Box display={"flex"} flexDirection={"column"} gap={1}>
          <BodyText variant="small" weight={"medium"}>
            Instruction
          </BodyText>
          <TextArea
            value={""}
            name="Instruction"
            height="120px"
            placeholder="Instruct your agent what to do"
          />
        </Box>
        <Box display={"flex"} gap={2} width={"100%"} alignItems={"center"}>
          <Input
            type="number"
            label="Max Output Token"
            name="maxOutputTokens"
            value={4568}
            showLabel
            onChange={() => {}}
          />
          <Input
            type="number"
            label="Temperature"
            name="temperature"
            value={0.1}
            min={0.1}
            max={0.9}
            showLabel
            onChange={() => {}}
          />
        </Box>
        <Box width={"100%"}>
          <SelectComponent
            label="Tools"
            name="type"
            value={"webSearch"}
            onChange={() => {}}
            options={toolLists}
          />
        </Box>
      </Box>
    </ModalContainer>
  );
}

export default AgentCreateModal;
