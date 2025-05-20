import { TextInput, TextInputProps } from "@mantine/core";
import clsx from "clsx";

export interface ITextInput extends TextInputProps {
  wrapperClassname?: string;
  hideLabel?: boolean;
  inputClassName?: string;
}

export const TxtInput: React.FC<ITextInput> = ({
  placeholder,
  className,
  classNames,
  onChange,
  wrapperClassname,
  hideLabel,
  inputClassName,
  value,
  ...props
}) => {
  const hasValue = !!value?.toString()?.length;

  return (
    <div
      className={clsx(
        "flex flex-col text-neutrals-high !min-h-[20px] relative justify-center",
        wrapperClassname
      )}
    >
      {hasValue && !hideLabel && (
        <p className="text-[9px] leading-[12px] font-normal">{placeholder}</p>
      )}
      <TextInput
        className={clsx("border-b border-b-neutrals-low", className)}
        classNames={{
          wrapper: "w-full",
          input: clsx(
            `${
              hasValue
                ? "body_small_semibold !h-[20px] !min-h-[20px] py-2 mb-0.5"
                : "caption_regular"
            }`,
            inputClassName
          ),
        }}
        variant="unstyled"
        onChange={onChange}
        value={value}
        placeholder={placeholder}
        {...props}
      />
    </div>
  );
};
