import { cn } from "../../utils/utils";

export function Progress({ value, className, indicatorClassName }) {
  return (
    <div
      className={cn(
        "relative w-full h-3 overflow-hidden rounded-full bg-gray-200",
        className
      )}
    >
      <div
        className={cn(
          "h-full transition-all duration-300 bg-blue-600",
          indicatorClassName
        )}
        style={{ width: `${value}%` }}
      />
    </div>
  );
}
