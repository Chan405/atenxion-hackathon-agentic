import { Typography } from "@mui/material";
import React, { ReactNode } from "react";

const HeadingH3 = ({ children }: { children: ReactNode }) => {
  return (
    <Typography
      sx={{
        fontWeight: 700,
        fontSize: { md: "20px", lg: "22px", xl: "24px" },
        lineHeight: "125%",
        fontFamily: "Figtree",
        color: "#052659",
      }}
    >
      {children}
    </Typography>
  );
};
export default HeadingH3;
