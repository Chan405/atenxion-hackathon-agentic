import { Box, Typography } from "@mui/material";
import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface IProps {
  msg: string;
}

function ChatResponse({ msg }: IProps) {
  return (
    <Box
      display="flex"
      gap={1}
      justifyContent="flex-start"
      width="80%"
      maxWidth={"80%"}
      overflow={"hidden"}
    >
      <Box
        display="flex"
        flexDirection={"column"}
        alignItems={"flex-start"}
        width={"fit-content"}
      >
        <Box
          py={2}
          px={3}
          mb={0.5}
          bgcolor={"transparent"}
          border={"1px solid #e6e6e6"}
          borderRadius="20px 20px 20px 0px"
        >
          <Box
            display="flex"
            flexDirection="column"
            fontSize={{ xs: "11px", md: "14px", xl: "16px" }}
            fontFamily={"Inter, sans-serif"}
            lineHeight={1.6}
            sx={{
              "& p": { marginBottom: "8px" },
            }}
          >
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                a: ({ node, ...props }) => (
                  <a target="_blank" rel="noopener noreferrer" {...props} />
                ),
              }}
            >
              {msg}
            </ReactMarkdown>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default ChatResponse;
