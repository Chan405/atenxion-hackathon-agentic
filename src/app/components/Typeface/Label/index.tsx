import { Typography } from "@mui/material";
import React, { ReactNode } from "react";

const Label = ({children}: {children: ReactNode}) => {
  return (
    <Typography
      sx={{
        fontWeight: 700,
        fontSize: { md: "10px", lg: "12px" },
        lineHeight: "125%",
        textTransform: 'uppercase',
      }}
    >
      {children}
    </Typography>
  );
};

export default Label;
