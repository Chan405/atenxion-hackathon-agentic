/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import ModalContainer from "../Modal";
import Input from "../Input";
import { Box } from "@mui/material";
import SelectComponent from "../SelectComponent";
import TextArea from "../TextArea";
import BodyText from "../../Typeface/BodyText";
import { Formik } from "formik";

interface ModalProps {
  open: boolean;
  handleClose: () => void;
  handleSaveAgent: (id: string, values: any) => void;
  selectedNode: any;
}

function AgentCreateModal({
  open,
  handleClose,
  selectedNode,
  handleSaveAgent,
}: ModalProps) {
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

  const values = selectedNode.data.fields;

  const initialValues = {
    name: values.name || "Agent 1",
    model: values.model || "gpt-4.1",
    instruction: values.instruction || "",
    temperature: values.temperature || 0.5,
    topP: values.topP || 10,
    tools: values.tools || [],
    maxOutputTokens: values.maxOutputTokens || 100,
    description: values.description || "",
  };
  console.log(selectedNode);

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={(values) => {
        console.log(values);
        handleSaveAgent(selectedNode.id, values);
      }}
    >
      {({ values, handleChange, handleSubmit, setFieldValue }) => (
        <ModalContainer
          width="550px"
          open={open}
          handleClose={handleClose}
          title={"Configure your agent"}
          cancelBtnText="Cancel"
          confirmBtnText={"Save"}
          confirmBtnHandler={(values) => handleSubmit(values)}
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
                value={values.name}
                placeholder="e.g., Customer Onboarding Flow"
                onChange={handleChange}
                width="100%"
                showLabel
              />
              <Box width={"50%"}>
                <SelectComponent
                  label="Model Type"
                  name="model"
                  value={values.model}
                  onChange={(e) => setFieldValue("model", e.target.value)}
                  options={modelLists}
                />
              </Box>
            </Box>
            <Box display={"flex"} flexDirection={"column"} gap={1}>
              <BodyText variant="small" weight={"medium"}>
                Description
              </BodyText>
              <TextArea
                value={values.description}
                name="description"
                height="80px"
                onChange={handleChange}
              />
            </Box>
            <Box display={"flex"} flexDirection={"column"} gap={1}>
              <BodyText variant="small" weight={"medium"}>
                Instruction
              </BodyText>
              <TextArea
                value={values.instruction}
                name="instruction"
                height="120px"
                placeholder="Instruct your agent what to do"
                onChange={handleChange}
              />
            </Box>
            <Box display={"flex"} gap={2} width={"100%"} alignItems={"center"}>
              <Input
                type="number"
                label="Max Output Token"
                name="maxOutputTokens"
                value={values.maxOutputTokens}
                showLabel
                onChange={handleChange}
              />
              <Input
                type="number"
                label="Temperature"
                name="temperature"
                value={values.temperature}
                min={0.1}
                max={0.9}
                showLabel
                onChange={handleChange}
              />
            </Box>
            <Box width={"100%"}>
              <SelectComponent
                label="Tools"
                name="tools"
                value={values.tools}
                onChange={(e) => setFieldValue("tools", e.target.value)}
                options={toolLists}
              />
            </Box>
          </Box>
        </ModalContainer>
      )}
    </Formik>
  );
}

export default AgentCreateModal;
