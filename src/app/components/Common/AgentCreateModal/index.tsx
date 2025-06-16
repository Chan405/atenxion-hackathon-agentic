import React from "react";
import ModalContainer from "../Modal";
import Input from "../Input";

interface ModalProps {
  open: boolean;
  handleClose: () => void;
  handleSubmit: () => void;
}

function AgentCreateModal({ open, handleClose }: ModalProps) {
  return (
    <ModalContainer
      width="550px"
      open={open}
      handleClose={handleClose}
      title={"Add New Agent to List"}
      cancelBtnText="Cancel"
      confirmBtnText={"Configure Agent"}
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
    </ModalContainer>
  );
}

export default AgentCreateModal;
