import { Box, Typography } from "@mui/material";
import React from "react";

interface IProps {
  msg: string;
  isParallel?: boolean;
  isAgent?: boolean;
  isTool?: boolean;
}

function SpecialResponse({
  msg,
  isParallel = false,
  isAgent = false,
  isTool = false,
}: IProps) {
  return (
    <Box
      display="flex"
      gap={1}
      justifyContent="flex-start"
      width="80%"
      maxWidth={"80%"}
      overflow={"hidden"}
      mt={2}
      mb={1}
    >
      <Box
        display="flex"
        flexDirection={"column"}
        alignItems={"flex-start"}
        width={"fit-content"}
      >
        <Box
          py={1.5}
          px={2}
          pr={3}
          mb={0.5}
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
            {isParallel
              ? `Parallel Agent Called: ${msg}`
              : isAgent
              ? `Agent Got Called: ${msg}`
              : isTool
              ? `Got Tool Called: ${msg}`
              : msg}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}

export default SpecialResponse;
