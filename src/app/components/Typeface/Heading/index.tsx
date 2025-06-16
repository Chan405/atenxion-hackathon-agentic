import { Typography } from "@mui/material";
import React, { ReactNode } from "react";

const Heading = ({ children }: { children: ReactNode }) => {
  return (
    <Typography
      sx={{
        fontWeight: 700,
        fontSize: { md: "22px", lg: "24px", xl: "26px" },
        lineHeight: "125%",
        fontFamily: "Figtree",
      }}
    >
      {children}
    </Typography>
  );
};

export default Heading;
