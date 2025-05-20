interface IContent {
  children?: React.ReactNode;
  className?: string;
}

const Content: React.FC<IContent> = ({ children, className }) => {
  return (
    <div className={`border-t border-neutrals-low bg-neutrals-background-surface px-8 py-4 !h-[calc(100vh-13rem)] flex-none ${className ?? ''}`}>
      {children}
    </div>
  )
};

export default Content;