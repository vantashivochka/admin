import React from "react";
import { cn } from "@/lib/utils";

interface MaxWidthWrapperProps {
  className?: string;
  id?: string;
  children: React.ReactNode;
}

const MaxWidthWrapper: React.FC<MaxWidthWrapperProps> = ({
  className,
  id,
  children,
}) => {
  return (
    <div
      className={cn(
        "mx-auto w-full max-w-full px-4 lg:px-20",
        className
      )}
      id={id}
    >
      {children}
    </div>
  );
};

export default MaxWidthWrapper;
