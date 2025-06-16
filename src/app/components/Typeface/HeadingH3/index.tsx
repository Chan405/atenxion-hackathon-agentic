import { Typography } from "@mui/material";
import React, { ReactNode } from "react";

const HeadingH3 = ({ children }: { children: ReactNode }) => {
  return (
    <Typography
      sx={{
        fontWeight: 700,
        fontSize: { md: "16px", lg: "16px", xl: "18px" },
        lineHeight: "125%",
        fontFamily: "Figtree",
      }}
    >
      {children}
    </Typography>
  );
};
export default HeadingH3;
