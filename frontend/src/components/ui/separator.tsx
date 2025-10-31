import * as React from "react";
import * as SeparatorPrimitive from "@radix-ui/react-separator";
import { cn } from "@/lib/utils";

interface SeparatorProps
  extends React.ComponentPropsWithoutRef<typeof SeparatorPrimitive.Root> {
  label?: string;
}

const Separator = React.forwardRef<
  React.ElementRef<typeof SeparatorPrimitive.Root>,
  SeparatorProps
>(
  (
    {
      className,
      orientation = "horizontal",
      decorative = true,
      label,
      ...props
    },
    ref,
  ) => {
    // 🔹 Simple labeled version
    if (label && orientation === "horizontal") {
      return (
        <div className="flex items-center w-full">
          <SeparatorPrimitive.Root
            ref={ref}
            decorative={decorative}
            orientation="horizontal"
            className={cn("shrink-0 bg-border h-[1px] w-[45.5%]", className)}
            {...props}
          />
          <span className="mx-2 text-sm text-muted-foreground select-none">
            {label}
          </span>
          <SeparatorPrimitive.Root
            decorative={decorative}
            orientation="horizontal"
            className={cn("shrink-0 bg-border h-[1px] w-[45.5%]", className)}
            {...props}
          />
        </div>
      );
    }

    // 🔹 Default Radix separator (no label)
    return (
      <SeparatorPrimitive.Root
        ref={ref}
        decorative={decorative}
        orientation={orientation}
        className={cn(
          "shrink-0 bg-border",
          orientation === "horizontal" ? "h-[1px] w-full" : "h-full w-[1px]",
          className,
        )}
        {...props}
      />
    );
  },
);

Separator.displayName = "Separator";

export { Separator };
