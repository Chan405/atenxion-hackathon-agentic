import { Box } from "@mui/material";
import { ChangeEvent } from "react";

interface IProps {
  name: string;
  onChange?: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  errors?: string;
  touched?: boolean;
  value?: string | number;
  height?: string;
  xsHeight?: string;
  placeholder?: string;
  bgColor?: string;
}

function TextArea({
  bgColor,
  name,
  onChange,
  value,
  height,
  xsHeight,
  placeholder = "Write or paste your data here",
}: IProps) {
  return (
    <Box
      sx={{
        marginRight: { xs: 1, sm: 0, md: 0 },
      }}
      display="flex"
      bgcolor={bgColor || "white"}
      borderRadius="12px"
      alignItems="center"
      justifyContent="center"
      border="1px solid #C1B9BB"
      height={{
        xs: xsHeight ? xsHeight : "60dvh",
        sm: height ? height : "245px",
      }}
      p={2}
    >
      <textarea
        name={name}
        onChange={onChange}
        placeholder={placeholder}
        style={{
          resize: "none",
          width: "100%",
          outline: "none",
          border: "none",
          height: "100%",
          backgroundColor: bgColor,
        }}
        value={value}
      />
    </Box>
  );
}

export default TextArea;
