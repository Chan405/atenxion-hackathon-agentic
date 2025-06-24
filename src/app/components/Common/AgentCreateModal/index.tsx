/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useRef } from "react";
import ModalContainer from "../Modal";
import Input from "../Input";
import { Box } from "@mui/material";
import SelectComponent from "../SelectComponent";
import TextArea from "../TextArea";
import BodyText from "../../Typeface/BodyText";
import { Formik } from "formik";
import TagInput from "../TagInput";
import IOSSwitch from "../IOSSwitch";
import Image from "next/image";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
interface ModalProps {
  open: boolean;
  handleClose: () => void;
  handleSaveAgent: (id: string, values: any) => void;
  selectedNode: any;
  removeAgent: any;
}

export const toolLists = [
  {
    value: "WebCrawlTavily",
    label: "Web Search",
    image: "/assets/websearch.png",
  },
  {
    value: "CodeInterpreter",
    label: "Code Interpreter",
    image: "/assets/code.png",
  },
  // {
  //   value: "AtenxionAgent",
  //   label: "Atenxion Agent",
  //   image: "/assets/Atenxion_Logo.svg",
  // },
  {
    value: "RAG",
    label: "RAG as a tool",
    image: "/assets/Atenxion_Logo.svg",
  },
  {
    value: "MCPLine",
    label: "LINE as MCP",
    image: "/assets/line.png",
  },
  {
    value: "Authenticator",
    label: "Authenticator",
    image: "/assets/authenticator.png",
  },
  {
    value: "HumanHandover",
    label: "Zoho Human Handover",
    image: "/assets/salesiq.png",
  },
];

export const guardrailsList = [
  {
    value: "JailbreakGuard",
    label: "Jailbreak",
    image: "/assets/criminal.png",
  },
  {
    value: "PIIGuard",
    label: "PII Guard",
    image: "/assets/personal-information.png",
  },
  {
    value: "AuthenticationGuard",
    label: "Authentication Guard",
    image: "/assets/shield.png",
  },
];

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
    outputKeys: values.outputKeys || [],
    datastore: values.datastore || "",
    isOrchestrator: values.isOrchestrator || false,
    guardrails: values.guardrails || [],
  };
  const advancedRef = useRef<HTMLDivElement>(null);
  const [advanceOpen, setAdvanceOpen] = React.useState(false);

  const handleAdvanceOpen = () => {
    setAdvanceOpen(!advanceOpen);
    advancedRef.current?.scrollIntoView({ behavior: "smooth" });
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
              <Box
                sx={{
                  border: "1px solid #E0E0E0",
                  borderRadius: "10px",
                  padding: "10px",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                  onClick={handleAdvanceOpen}
                >
                  <Box>
                    <BodyText variant="small" weight={"medium"}>
                      Advance Setting
                    </BodyText>
                  </Box>
                  <Box>
                    {advanceOpen ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}
                  </Box>
                </Box>
                {advanceOpen && (
                  <Box sx={{ mt: 3 }}>
                    <Box display={"flex"} flexDirection={"column"} gap={1}>
                      <BodyText variant="small" weight={"medium"}>
                        Output Keys
                      </BodyText>
                      <TagInput
                        values={values?.outputKeys}
                        onChangeHandler={(newValue) => {
                          setFieldValue("outputKeys", newValue);
                        }}
                        placeholder=""
                      />
                    </Box>
                    <Box
                      display={"flex"}
                      mt={-5}
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
                    <Box width={"100%"} sx={{ mt: 2 }}>
                      <Box
                        sx={{
                          padding: "10px",
                        }}
                      >
                        <BodyText
                          variant="small"
                          mb={1}
                          sx={{ display: "flex", flexDirection: "column" }}
                        >
                          Tools
                        </BodyText>
                        {toolLists.map((tool) => (
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              marginBottom: "10px",
                            }}
                            key={tool.value}
                          >
                            <Image
                              src={tool.image}
                              alt={tool.label}
                              width={30}
                              height={30}
                              style={{ marginRight: "10px" }}
                            />{" "}
                            <Box
                              display="flex"
                              alignItems="center"
                              justifyContent="space-between"
                              width="100%"
                              paddingY={1}
                            >
                              <BodyText variant="small" weight="regular">
                                {tool.label}
                              </BodyText>
                              <IOSSwitch
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
                                name="toggleSwitch"
                                color="primary"
                              />
                            </Box>
                          </Box>
                        ))}

                        {values.tools.includes("RAG") && (
                          <Input
                            type="Datastore"
                            label="Datastore"
                            name="datastore"
                            min={0}
                            max={1}
                            value={values.datastore || ""}
                            placeholder="Enter the datastore name you want to use"
                            showLabel
                            onChange={handleChange}
                          />
                        )}
                      </Box>
                    </Box>
                    <Box width={"100%"} sx={{ mt: 2 }}>
                      <Box
                        sx={{
                          padding: "10px",
                        }}
                      >
                        <BodyText
                          variant="small"
                          mb={1}
                          sx={{ display: "flex", flexDirection: "column" }}
                        >
                          Guardrails
                        </BodyText>
                        {guardrailsList.map((guard) => (
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              marginBottom: "10px",
                            }}
                            key={guard.value}
                          >
                            <Image
                              src={guard.image}
                              alt={guard.label}
                              width={30}
                              height={30}
                              style={{ marginRight: "10px" }}
                            />{" "}
                            <Box
                              display="flex"
                              alignItems="center"
                              justifyContent="space-between"
                              width="100%"
                              paddingY={1}
                            >
                              <BodyText variant="small" weight="regular">
                                {guard.label}
                              </BodyText>
                              <IOSSwitch
                                checked={values.guardrails.includes(
                                  guard.value
                                )}
                                onChange={(e) => {
                                  const checked = e.target.checked;
                                  const newValue = checked
                                    ? [...values.guardrails, guard.value]
                                    : values.guardrails.filter(
                                        (val: any) => val !== guard.value
                                      );
                                  setFieldValue("guardrails", newValue);
                                }}
                                name="toggleSwitch"
                                color="primary"
                              />
                            </Box>
                          </Box>
                        ))}
                      </Box>
                    </Box>
                  </Box>
                )}
              </Box>
            </Box>
          </ModalContainer>
        );
      }}
    </Formik>
  );
}

export default AgentCreateModal;
