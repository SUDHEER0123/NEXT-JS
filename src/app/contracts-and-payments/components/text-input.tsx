import { TextInput, TextInputProps } from "@mantine/core";

export interface ITextInput extends TextInputProps {}

export const TxtInput: React.FC<ITextInput> = ({ placeholder, ...props }) => {
  return (
    <TextInput
      placeholder={placeholder}
      className="border-b border-b-neutrals-low"
      classNames={{
        input: 'text-xs text-neutrals-high'
      }}
      variant="unstyled"
      {...props}
    />
  );
};