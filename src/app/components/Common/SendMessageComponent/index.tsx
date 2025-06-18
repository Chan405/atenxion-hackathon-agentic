import React from "react";
import { IoSend } from "react-icons/io5";
import { Box, TextareaAutosize } from "@mui/material";

const SendMessageComponent = ({
  question,
  setQuestion,
  submitMessage,
}: {
  question: string;
  setQuestion: (value: string) => void;
  submitMessage: () => void;
}) => {
  const handleKeyDown = (event: any) => {
    if (
      event.key === "Enter" &&
      !event.shiftKey &&
      question &&
      question.trim()
    ) {
      event.preventDefault();
      submitMessage();
    } else if (event.key === "Enter" && event.shiftKey) {
      setQuestion(question + "\n");
    }
  };

  return (
    <>
      <Box
        boxSizing={"border-box"}
        bgcolor={"white"}
        padding={"12px 16px 12px 16px"}
        border="1px solid #E6E6E6"
        borderRadius={"0px 0px 12px 12px"}
        display={"flex"}
        justifyContent={"start"}
        alignItems={"center"}
        marginX={1}
        width={"100%"}
      >
        <Box
          display={"flex"}
          gap={2}
          alignItems={"center"}
          justifyContent={"center"}
          width={"1"}
        >
          <TextareaAutosize
            value={question}
            onChange={(e) => {
              if (e.target.textLength > 600) {
                console.log("Exceeds to 600 characters limit");
                return;
              }
              setQuestion(e.target.value);
            }}
            placeholder={"Ask something"}
            onKeyDown={handleKeyDown}
            style={{
              border: "none",
              outline: "none",
              resize: "none",
              width: "100%",
              height: "17.5px",
              maxHeight: "35px",
              fontSize: "14px",
              lineHeight: "17.5px",
              backgroundColor: "transparent",
              display: "flex",
              alignItems: "center",
            }}
          />{" "}
          <Box
            sx={{
              fontSize: "20px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              color: question.trim().length !== 0 ? "#00BFA1" : "#DFDCDD",
            }}
            onClick={
              question.trim().length === 0
                ? () => {}
                : (e) => {
                    e.stopPropagation();
                    submitMessage();
                  }
            }
          >
            <IoSend color={question?.length > 0 ? "#052659" : "gray"} />
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default SendMessageComponent;
