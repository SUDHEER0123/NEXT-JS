// components/WideInput.tsx
import { useEffect, useState } from 'react';

interface IWideInput {
  length?: number;
  className?: string;
  onValueChange?: (value: string[]) => void;
}

const WideInput: React.FC<IWideInput> = ({ length = 6, className = '', onValueChange }) => {
  const [value, setValue] = useState<string[]>(new Array(length).fill(''));

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    // Get the entered value and allow only numeric input
    const inputValue = e.target.value.toLocaleUpperCase();
    const newValue = [...value];
    newValue[index] = inputValue.slice(0, 1); // Only allow one character per input
    setValue(newValue);

    // Move to the next input if there's a value
    if (inputValue) {
      const nextInput = document.getElementById(`input-${index + 1}`) as HTMLInputElement;
      if (nextInput) nextInput.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace' && !value[index]) {
      // Focus the previous input when backspace is pressed on an empty input
      const prevInput = document.getElementById(`input-${index - 1}`) as HTMLInputElement;
      if (prevInput) prevInput.focus();
    }
  };

  useEffect(() => {
    if (onValueChange) onValueChange(value);
  }, [value]);

  return (
    <div className="flex justify-between space-x-2">
      {value.map((val, index) => (
        <input
          key={index}
          id={`input-${index}`}
          type="text"
          value={val}
          onChange={e => handleChange(e, index)}
          onKeyDown={e => handleKeyDown(e, index)}
          maxLength={1}
          className={`w-12 h-12 text-center text-2xl rounded-md focus:outline-none focus:none focus:ring-blue-500 border-b-brand-primary rounded-b-none bg-transparent border-b-2 border-transparent focus:border-brand-secondary focus:outline-none text-white caret-brand-secondary font-medium ${className}`}
        />
      ))}
    </div>
  );
};

export default WideInput;
