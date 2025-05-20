import { Input } from "@mantine/core";

export interface TextInputProps {
  placeholder: string;
  className?: string;
}

export const TextInput: React.FC<TextInputProps> = ({ placeholder, className, ...props }) => {
  return (
    <Input.Wrapper className={`${className} pb-2`}>
      <Input.Placeholder className="text-neutrals-high text-[12px] leading-[18px]">{placeholder}</Input.Placeholder>
    </Input.Wrapper>
  )
}