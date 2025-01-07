import TextField from "@mui/material/TextField";
import { memo, ReactNode, ChangeEvent } from "react";

interface InputTextProps {
  type: string;
  name: string;
  value: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  errorText?: string | ReactNode;
  InputProps:any
}

const InputText: React.FC<InputTextProps> = ( props: InputTextProps) => {
  const { type, name, value, onChange=()=>{}, errorText,InputProps } = props;
  
  return (
    <TextField
      autoFocus
      margin="dense"
      name={name}
      id={name}
      type={type}
      fullWidth
      value={value}
      onChange={onChange}
      error={!!errorText}
      helperText={errorText}
      InputProps={InputProps}
    />
  );
};

export default memo(InputText);
