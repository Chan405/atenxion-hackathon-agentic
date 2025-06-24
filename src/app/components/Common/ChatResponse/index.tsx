/* eslint-disable */

import { Box, Divider, Typography } from "@mui/material";
import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface IProps {
  msg: string;
  isHuman?: boolean;
  isSystem?: boolean;
}

function ChatResponse({ msg, isHuman, isSystem }: IProps) {
  if (isSystem)
    return (
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        my={5}
        boxSizing={"border-box"}
        px={5}
        width="100%"
        alignSelf={"center"}
      >
        <Divider sx={{ flex: 1, borderColor: "#7889a1" }} />
        <Typography
          variant="body2"
          sx={{ mx: 2, color: "#052659", whiteSpace: "nowrap" }}
        >
          {msg}
        </Typography>
        <Divider sx={{ flex: 1, borderColor: "#7889a1" }} />
      </Box>
    );
  return (
    <Box
      display="flex"
      gap={1}
      justifyContent="flex-start"
      alignItems={"center"}
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
          py={1.5}
          px={3}
          mt={1}
          display={"flex"}
          alignItems={"center"}
          bgcolor={isHuman ? "#e5f3fd" : "transparent"}
          border="1px solid #e6e6e6"
          borderRadius="20px 20px 20px 0px"
        >
          <Box
            fontSize={{ xs: "11px", md: "14px", xl: "16px" }}
            fontFamily={"Inter, sans-serif"}
            lineHeight={1.6}
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
