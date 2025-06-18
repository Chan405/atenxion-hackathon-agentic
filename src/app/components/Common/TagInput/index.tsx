import { Box } from "@mui/material";
import { TagsInput } from "react-tag-input-component";
import "../../../globals.css";

interface TagInputProps {
  values: string[];
  onChangeHandler: (values: string[]) => void;
  placeholder?: string;
}

function TagInput({ values, onChangeHandler, placeholder }: TagInputProps) {
  // const [domainErrors, setDomainErrors] = useState<string[]>([]);

  const handleDomainChange = (newValue: string[]) => {
    onChangeHandler(newValue);
  };

  return (
    <Box sx={{ height: "100px" }}>
      <TagsInput
        value={values}
        onChange={handleDomainChange}
        placeHolder={placeholder}
      />
    </Box>
  );
}

export default TagInput;
