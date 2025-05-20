import { NumberInput, NumberInputProps } from "@mantine/core";

export interface INumberInput extends NumberInputProps {}

export const NumInput: React.FC<INumberInput> = ({ placeholder, ...props }) => {
  return (
    <NumberInput
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