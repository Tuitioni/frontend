import { LoadingSpinner } from "./LoadingSpinner";

interface LoadingSpinnerCenterProps {
  size?: "sm" | "md" | "lg";
}

export function LoadingSpinnerCenter({
  size = "lg",
}: LoadingSpinnerCenterProps) {
  return (
    <div className="flex items-center justify-center min-h-[400px] w-full">
      <LoadingSpinner size={size} />
    </div>
  );
}
