/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import ModalContainer from "../Modal";
import { Box } from "@mui/material";
import BodyText from "../../Typeface/BodyText";
import TextArea from "../TextArea";

interface ModalProps {
  open: boolean;
  handleClose: () => void;
  handleSavePrompt: () => void;
  handleChange: any;
  prompt: string;
}
function ResponsePickerPromptModal({
  open,
  handleClose,
  handleSavePrompt,
  handleChange,
  prompt,
}: ModalProps) {
  return (
    <ModalContainer
      width="550px"
      open={open}
      handleClose={handleClose}
      title={"Write Response Picker Prompt"}
      cancelBtnText="Cancel"
      confirmBtnText={"Save"}
      confirmBtnHandler={handleSavePrompt}
    >
      <Box display={"flex"} flexDirection={"column"} gap={1} my={4}>
        <BodyText variant="small" weight={"medium"}>
          Instruction
        </BodyText>
        <TextArea
          value={prompt}
          name="instruction"
          height="120px"
          placeholder="Instruct your agent what to do"
          onChange={(e) => {
            handleChange(e);
          }}
        />
      </Box>
    </ModalContainer>
  );
}

export default ResponsePickerPromptModal;
