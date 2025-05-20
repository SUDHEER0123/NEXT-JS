import { useState } from "react";

interface ICollapsibleText {
  title?: string;
  description?: string;
  showLessText?: string;
  showMoreText?: string;
  onShowMore?: () => void;
  onShowLess?: () => void;
}

export const CollapsibleText: React.FC<ICollapsibleText> = ({ title, description, ...props }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="flex flex-col gap-y-2">
      <p className="body_small_semibold text-neutrals-high">{title}</p>
      {isExpanded && <p className="caption_regular text-neutrals-high break-words">{description}</p>}
      <p className="text-brand-primary caption_semibold cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>{isExpanded ? "Show Less":"Show More"}</p>
    </div>
  )
};