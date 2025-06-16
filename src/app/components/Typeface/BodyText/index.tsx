import { Typography, TypographyProps } from "@mui/material";
import React, { ReactNode } from "react";

interface BodyTextProps extends Omit<TypographyProps, "variant"> {
  children: ReactNode;
  weight?: "regular" | "medium" | "semibold";
  variant: "large" | "medium" | "small" | "caption";
  color?: string;
  component?: "span";
  lineHeight?: string;
  fontWeight?: number;
  // props?: React.ComponentProps<typeof Typography>;
}

const BodyText = ({
  children,
  weight,
  variant,
  color = "#000",
  component,
  lineHeight,
  ...props
}: BodyTextProps) => {
  const weightDic = {
    regular: 400,
    medium: 500,
    semibold: 600,
  };
  const defaultWeight = variant === "large" ? "medium" : "regular";
  switch (variant) {
    case "large":
      return (
        <Typography
          {...props}
          sx={{
            fontWeight: weight ? weightDic[weight] : defaultWeight,
            fontSize: { md: "16px", xl: "18px" },
            lineHeight: lineHeight ? lineHeight : "100%",
            color: color,
            fontFamily: "Inter, sans-serif",
          }}
        >
          {children}
        </Typography>
      );
    case "medium":
      return (
        <Typography
          {...props}
          sx={{
            fontWeight: weight ? weightDic[weight] : defaultWeight,
            fontSize: { xs: "11px", md: "14px", lg: "16px", xl: "16px" },
            lineHeight: lineHeight ? lineHeight : "125%",
            color: color,
          }}
          component={component ? component : "p"}
        >
          {children}
        </Typography>
      );
    case "small":
      return (
        <Typography
          {...props}
          sx={{
            fontWeight: weight ? weightDic[weight] : defaultWeight,
            fontSize: { md: "13px", lg: "14px", xl: "14px" },
            lineHeight: lineHeight ? lineHeight : "125%",
            color: color,
          }}
        >
          {children}
        </Typography>
      );

    case "caption":
      return (
        <Typography
          {...props}
          sx={{
            fontWeight: weight ? weightDic[weight] : defaultWeight,
            fontSize: { md: "12px", lg: "12px", xl: "12px" },
            lineHeight: lineHeight ? lineHeight : "125%",
            color: color,
            textTransform: "uppercase",
          }}
        >
          {children}
        </Typography>
      );
  }
};

export default BodyText;
