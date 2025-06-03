import { serviceLogger as log } from "../../../utils/logger";

interface TextInputProps {
  value: string;
  placeholder?: string;
  onChanged: (value: string) => void;
}

export const TextInput = ({
  value,
  placeholder,
  onChanged
}: TextInputProps) => {
  return (
    <entry
      text={value}
      placeholder_text={placeholder}
      onChanged={(self) => {
        const newValue = self.text;
        log.debug(`Text input value changed: ${newValue}`);
        onChanged(newValue);
      }}
      width_request={150}
    />
  );
};