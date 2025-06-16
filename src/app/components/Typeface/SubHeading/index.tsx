import theme from "@/app/utils/theme";
import { Typography, TypographyProps } from "@mui/material";
import React, { ReactNode } from "react";

interface SubHeadingProps extends TypographyProps {
  children: ReactNode;
  color?: string;
  fontSize?: string;
  props?: React.ComponentProps<typeof Typography>;
}

const SubHeading = ({
  children,
  color,
  fontSize,
  ...props
}: SubHeadingProps) => {
  return (
    <Typography
      {...props}
      sx={{
        fontWeight: 700,
        fontSize: fontSize || { md: "24px", lg: "20px", xl: "28px" },
        lineHeight: "125%",
        color: color ? color : theme.palette.custom.black,
      }}
    >
      {children}
    </Typography>
  );
};

export default SubHeading;
