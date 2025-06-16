import Button from "@mui/material/Button";
import { darken } from "@mui/material/styles";
import CircularProgress from "@mui/material/CircularProgress";
import { Typography } from "@mui/material";

interface ButtonComponentProps {
  icon?: React.ReactNode;
  label: string;
  width?: string;
  height?: string;
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
  color?: string;
  textColor?: string;
  borderRadius?: string;
}
function ButtonComponent({
  borderRadius = "8px",
  icon,
  label,
  width = "fit-content",
  onClick,
  disabled = false,
  loading = false,
  height,
  color = "#000",
  textColor = "#fff",
}: ButtonComponentProps) {
  return (
    <Button
      onClick={onClick}
      className="button"
      variant="contained"
      disabled={disabled || loading}
      sx={{
        "&:hover": {
          backgroundColor: darken(color, 0.15),
          boxShadow: "none !important",
        },
        width: width,
        textTransform: "none",
        height: height || "48px",
        borderRadius: borderRadius || "80px",
        background: disabled ? "#BBB9BA" : color,
        letterSpacing: 0.5,
        boxShadow: "none",
        px: "16px",
        py: "12px",
      }}
    >
      {icon}
      {loading ? (
        <CircularProgress color="secondary" size={25} />
      ) : (
        // <BodyText variant="medium" color={textColor} weight={weight}>
        //   {label}
        // </BodyText>
        <Typography
          sx={{
            fontSize: { md: "14px", lg: "14px", xl: "16px" },
            color: textColor,
            fontWeight: "600",
          }}
        >
          {label}
        </Typography>
      )}
    </Button>
  );
}

export default ButtonComponent;
