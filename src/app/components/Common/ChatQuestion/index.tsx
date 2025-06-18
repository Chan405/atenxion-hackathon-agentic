import { Box, Typography } from "@mui/material";
import React from "react";

interface IProps {
  msg: string;
}

function ChatQuestion({ msg }: IProps) {
  return (
    <Box
      display="flex"
      gap={1}
      justifyContent="flex-end"
      width="100%"
      maxWidth={"100%"}
      overflow={"hidden"}
    >
      <Box
        display="flex"
        flexDirection={"column"}
        alignItems={"flex-end"}
        width={"fit-content"}
      >
        <Box
          py={1.5}
          px={2}
          mb={0.5}
          bgcolor={"transparent"}
          border={"1px solid #e6e6e6"}
          borderRadius="20px 0px 20px 20px"
        >
          <Typography
            sx={{
              color: "#636464",
              fontSize: { md: "14px", xl: "16px" },
            }}
          >
            {msg}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}

export default ChatQuestion;
