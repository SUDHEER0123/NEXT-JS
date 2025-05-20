// components/CopyText.tsx
import { CheckIcon, ClipboardDocumentCheckIcon, ClipboardDocumentIcon } from "@heroicons/react/24/outline";
import { useState } from "react";

const CopyText: React.FC<{ text: string, textClassName: string }> = ({ text, textClassName }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);

      // Reset the "copied" state after 2 seconds
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  return (
    <div className="flex flex-row space-x-1">
      <span className={textClassName}>{text}</span>
      {copied ? (
        <CheckIcon className="w-6 h-6 text-brand-primary cursor-pointer" />
       ) : (
        <ClipboardDocumentIcon className="w-6 h-6 text-neutrals-medium cursor-pointer" onClick={handleCopy} />
       )}
    </div>
  );
};

export default CopyText;