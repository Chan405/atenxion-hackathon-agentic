import { Button, CircularProgress, Typography } from "@mui/material";
import { ReactNode } from "react";
import theme from "@/app/utils/theme";

interface IProps {
  background?: string;
  color?: string;
  label: string;
  width: string;
  icon?: ReactNode;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  height?: string;
  loading?: boolean;
  showBorder?: boolean;
  fontWeight?: number;
  borderRadius?: string;
  px?: string;
  disabled?: boolean;
}
function OutlineButton({
  background = "white",
  label,
  width,
  icon,
  onClick,
  height,
  color = "black",
  loading = false,
  showBorder = true,
  fontWeight,
  borderRadius,
  px,
  disabled = false,
}: IProps) {
  return (
    <Button
      onClick={onClick}
      className="button"
      variant="contained"
      sx={{
        width: width,
        textTransform: "none",
        height: height || "48px",
        borderRadius: borderRadius || "80px",
        background: disabled ? "#cccacb" : background,
        border: showBorder
          ? color
            ? `1px solid ${color}`
            : "1px solid black"
          : "none",
        color: color ? color : "black",
        fontWeight: fontWeight || 600,
        boxShadow: "none",
        gap: 1,
        "&:hover": {
          backgroundColor: background || "white",
          boxShadow: "none",
        },
        px: px || "16px",
        py: "12px",
      }}
      disabled={disabled || loading}
    >
      {icon && icon}
      {loading ? (
        <CircularProgress color="secondary" size={25} />
      ) : (
        // <BodyText
        //   variant="medium"
        //   weight="medium"
        //   // weight={disabled ? "medium" : "semibold"}
        //   color={color ? color : theme.palette.custom.black}
        // >
        //   {label}
        // </BodyText>
        <Typography
          sx={{
            fontSize: { md: "14px", lg: "14px", xl: "16px" },
            color: color ? color : theme.palette.custom.black,
          }}
        >
          {label}
        </Typography>
      )}
    </Button>
  );
}

export default OutlineButton;
