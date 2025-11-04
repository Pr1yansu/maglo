import React from "react";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

interface SearchBoxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  iconClassName?: string;
  inputClassName?: string;
}

const SearchBox: React.FC<SearchBoxProps> = ({
  iconClassName,
  inputClassName,
  className,
  ...props
}) => {
  const inputRef = React.useRef<HTMLInputElement>(null);

  const handleFocus = () => {
    inputRef.current?.focus();
  };

  return (
    <div className="flex">
      <div
        onClick={handleFocus}
        className={cn(
          "flex items-center gap-3 px-4 py-2 dark:border-0 border dark:bg-secondary-foreground/20 rounded-lg cursor-text focus-within:ring-2 focus-within:ring-primary/30 transition-all",
          className
        )}
      >
        <Search className={cn("text-muted-foreground", iconClassName)} />
        <input
          ref={inputRef}
          {...props}
          className={cn(
            "flex-1 bg-transparent outline-none placeholder:text-muted-foreground text-sm w-full",
            inputClassName
          )}
        />
      </div>
    </div>
  );
};

export default SearchBox;
