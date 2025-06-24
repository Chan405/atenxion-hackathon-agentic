/* eslint-disable */

import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Typography,
} from "@mui/material";
import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
interface IProps {
  msg: string;
  agent?: string;
  isParallel?: boolean;
  isAgent?: boolean;
  isTool?: boolean;
}

function ChatResponse({
  msg,
  agent,
  isParallel = false,
  isAgent = false,
  isTool = false,
}: IProps) {
  return (
    <Box
      display="flex"
      flexDirection="column"
      gap={1}
      justifyContent="flex-start"
      width="80%"
      maxWidth={"80%"}
      overflow={"hidden"}
    >
      <Accordion
        defaultExpanded
        sx={{
          // bgcolor:"red",
          boxShadow: "none",
          border: "none",
          "&:before": {
            display: "none",
          },
        }}
      >
        <Box
          display="flex"
          flexDirection={"column"}
          alignItems={"flex-start"}
          width={"fit-content"}
          mb={1}
        >
          <Box
            // py={1.5}
            // px={2}
            // pr={3}
            // mb={0.5}
            bgcolor={isTool ? "green" : isParallel ? "#725CAD" : "#0B1D51"}
            borderRadius="8px 8px 8px 0px"
          >
            <Typography
              display="flex"
              color="white"
              flexDirection="column"
              fontSize={{ xs: "11px", md: "14px", xl: "16px" }}
              fontFamily={"Inter, sans-serif"}
              lineHeight={1.6}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon sx={{ color: "white" }} />}
                aria-controls="panel1-content"
                id="panel1-header"
                sx={{}}
              >
                {isParallel
                  ? `Parallel Agent Called: ${agent}`
                  : isAgent
                  ? `Agent Got Called: ${agent}`
                  : isTool
                  ? `Got Tool Called: ${agent}`
                  : msg}
              </AccordionSummary>
            </Typography>
          </Box>
        </Box>
        <Box
          display="flex"
          flexDirection={"column"}
          alignItems={"flex-start"}
          width={"fit-content"}
        >
          <Box
            py={1}
            // px={3}
            mb={1.5}
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
              <AccordionDetails>
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
              </AccordionDetails>
            </Box>
          </Box>
        </Box>
      </Accordion>
    </Box>
  );
}

export default ChatResponse;
