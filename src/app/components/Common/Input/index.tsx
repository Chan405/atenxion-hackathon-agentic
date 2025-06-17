"use client";

import { Box, Theme, Typography, useMediaQuery } from "@mui/material";

import { ReactNode, useState } from "react";
import BodyText from "../../Typeface/BodyText";

interface IProps {
  placeholder?: string;
  type?: string;
  label?: string;
  name?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  showLabel?: boolean;
  value: string | number;
  height?: string;
  icon?: ReactNode;
  showBorder?: boolean;
  step?: string;
  min?: number;
  max?: number;
  labelOpacity?: number;
  postFix?: string;
  disabled?: boolean;
  weight?: "regular" | "medium" | "semibold";
  width?: string;
  borderRadius?: string;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  description?: string;
  autoFocus?: boolean;
}
function Input({
  placeholder,
  type = "text",
  label,
  name,
  onChange,

  showLabel = false,
  value,
  height,
  icon,

  step,
  min,
  max,
  labelOpacity,
  postFix,
  disabled,
  weight = "medium",
  width = "auto",
  borderRadius = "12px",
  onKeyDown,
  description,
  autoFocus = false,
}: IProps) {
  const [focusBorderColor, setFocusBorderColor] = useState<string>("#aaa");

  const handleFocus = () => {
    setFocusBorderColor("#000");
  };
  const handleBlur = () => {
    setFocusBorderColor("#aaa");
  };
  const isMobile = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down("xl")
  );

  return (
    <Box>
      {showLabel && label && (
        <Box
          mb="6px"
          color="#1C1718"
          sx={{ opacity: labelOpacity ? labelOpacity : 1 }}
        >
          <BodyText variant="small" weight={weight}>
            {label}
          </BodyText>
        </Box>
      )}
      {showLabel && description && (
        <Box mb="6px" color="#636464" sx={{ opacity: 0.8 }}>
          <BodyText variant="small" weight={"regular"}>
            {description}
          </BodyText>
        </Box>
      )}
      <Box
        position="relative"
        display="flex"
        bgcolor={showLabel ? "white" : "#F1EEEF"}
        borderRadius={borderRadius}
        height={height || "48px"}
        alignItems="center"
        justifyContent="center"
        width={width}
        border={`1px solid ${focusBorderColor}`}
        // maxWidth="350px"
        //   gap={2}
        px={2}
      >
        <input
          name={name}
          placeholder={placeholder}
          onChange={onChange}
          onKeyDown={onKeyDown}
          type={type}
          style={{
            fontSize: isMobile ? "14px" : "16px",
            width: "100%",
            outline: "none",
            backgroundColor: showLabel ? "white" : "#F1EEEF",
            border: "none",
            color: disabled ? "#8e9095" : "#1d212b",
            fontWeight: "400",
            //   height: "100%",
            paddingRight: "12px",
            fontFamily: "Inter, sans-serif",
            marginRight: type === "password" ? "14px" : "0px",
          }}
          value={value}
          step={step && step}
          autoFocus={autoFocus}
          onFocus={handleFocus}
          onBlur={handleBlur}
          min={min}
          max={max}
          disabled={disabled}
          className="atenxion-custom-input"
        />
        {postFix && (
          <Typography fontSize={"14px"} color={"#8E9095"} width={"100px"}>
            {postFix}
          </Typography>
        )}
        {icon && icon}
      </Box>
    </Box>
  );
}

export default Input;
