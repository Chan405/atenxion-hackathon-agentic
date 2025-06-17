/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect } from "react";
import ModalContainer from "../Modal";
import Input from "../Input";
import { Box, Checkbox, FormControlLabel } from "@mui/material";
import SelectComponent from "../SelectComponent";
import TextArea from "../TextArea";
import BodyText from "../../Typeface/BodyText";
import { Formik } from "formik";
import TagInput from "../TagInput";

interface ModalProps {
  open: boolean;
  handleClose: () => void;
  handleSaveAgent: (id: string, values: any) => void;
  selectedNode: any;
  removeAgent: any;
}

function AgentCreateModal({
  open,
  handleClose,
  selectedNode,
  handleSaveAgent,
  removeAgent,
}: ModalProps) {
  const modelLists = [
    { value: "gpt-4.1", label: "GPT 4.1" },
    { value: "gpt-4o", label: "GPT 4o" },
    { value: "gemini-2.5-pro-preview-05-06", label: "Gemini 2.5" },
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
    temperature: values.temperature || 0.7,
    topP: values.topP || 1.0,

    tools: values.tools || [],
    maxOutputToken: values.maxOutputToken || 16000,
    description: values.description || "",
    outputKeys: [],
  };

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={(values) => {
        handleSaveAgent(selectedNode.id, values);
      }}
    >
      {({ values, handleChange, handleSubmit, setFieldValue }) => {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        useEffect(() => {
          let defaultToken;
          switch (values.model) {
            case "gpt-4.1":
              defaultToken = 32000;
              break;
            case "gpt-4o":
              defaultToken = 16000;
              break;
            case "gemini-2.5-pro-preview-04-17":
              defaultToken = 65000;
              break;
          }
          setFieldValue("maxOutputToken", defaultToken);
        }, [values.model]);

        return (
          <ModalContainer
            width="550px"
            open={open}
            handleClose={handleClose}
            title={"Configure your agent"}
            cancelBtnText="Cancel"
            confirmBtnText={"Save"}
            confirmBtnHandler={(values) => handleSubmit(values)}
            confirmDelete={() => removeAgent(selectedNode.id)}
            showDeleteBtn
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
              <Box
                display={"flex"}
                alignItems={"center"}
                width={"100%"}
                gap={2}
                justifyContent={"space-between"}
              >
                <Input
                  name="name"
                  label="Agent Name"
                  value={values.name}
                  placeholder="e.g., Customer Onboarding Flow"
                  onChange={handleChange}
                  width="100%"
                  showLabel
                />
                <Box width={"40%"}>
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

              <Box display={"flex"} flexDirection={"column"} gap={1}>
                <BodyText variant="small" weight={"medium"}>
                  Output Keys
                </BodyText>
                <TagInput
                  values={values?.outputKeys}
                  onChangeHandler={(newValue) => {
                    console.log(newValue);
                    setFieldValue("outputKeys", newValue);
                  }}
                  placeholder=""
                />
              </Box>
              <Box
                display={"flex"}
                gap={2}
                width={"100%"}
                alignItems={"center"}
              >
                <Input
                  type="number"
                  label="Max Output Token"
                  name="maxOutputToken"
                  value={values.maxOutputToken}
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
                <Input
                  type="number"
                  label="Top P"
                  name="topP"
                  min={0}
                  max={1}
                  value={values.topP}
                  showLabel
                  onChange={handleChange}
                />
              </Box>

              <Box width={"100%"}>
                {/* <SelectComponent
                  label="Tools"
                  name="tools"
                  value={values.tools}
                  onChange={(e) => setFieldValue("tools", e.target.value)}
                  options={toolLists}
                /> */}
                <Box>
                  <BodyText variant="small" mb={1}>
                    Tools
                  </BodyText>
                  {toolLists.map((tool) => (
                    <FormControlLabel
                      key={tool.value}
                      color="#000"
                      control={
                        <Checkbox
                          checked={values.tools.includes(tool.value)}
                          onChange={(e) => {
                            const checked = e.target.checked;
                            const newValue = checked
                              ? [...values.tools, tool.value]
                              : values.tools.filter(
                                  (val: any) => val !== tool.value
                                );
                            setFieldValue("tools", newValue);
                          }}
                          name="tools"
                        />
                      }
                      label={tool.label}
                    />
                  ))}
                </Box>
              </Box>
            </Box>
          </ModalContainer>
        );
      }}
    </Formik>
  );
}

export default AgentCreateModal;
