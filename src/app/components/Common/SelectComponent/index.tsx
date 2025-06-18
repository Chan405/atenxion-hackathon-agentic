import MenuItem from "@mui/material/MenuItem";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { Box, OutlinedInput, Typography } from "@mui/material";

interface IProps {
  height?: string;
  label?: string;
  name: string;
  onChange?: (
    e: SelectChangeEvent<string | number>,
    child: React.ReactNode
  ) => void;
  value: string | number;
  options: {
    value: string | number;
    label: string;
  }[];
  borderRadius?: string;
}

function SelectComponent({
  height,
  name,
  onChange,
  label,
  options,
  value,
}: IProps) {
  return (
    <Box width={"100%"}>
      {label && (
        <Typography
          fontSize={{ md: "14px", xs: "12px" }}
          fontWeight={500}
          color="#1C1718"
          mb="6px"
        >
          {label}
        </Typography>
      )}
      <Select
        value={value}
        sx={{
          height,
          width: "100%",
          borderRadius: "12px",
          fontSize: "14px",
          outline: "none",
          backgroundColor: "white",
          "&:MuiPaper-root": {
            boxShadow: "none",
          },
          textAlign: "left",
        }}
        name={name}
        label={label}
        onChange={onChange}
        input={<OutlinedInput />}
      >
        {options.map((opt) => (
          <MenuItem
            value={opt.value}
            key={opt.label}
            style={{ fontSize: "13px" }}
          >
            {opt.label}
          </MenuItem>
        ))}
      </Select>
    </Box>
  );
}

export default SelectComponent;
