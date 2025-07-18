import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// Reusable IconButton with gradient icon
export function GradientIconButton({
  tooltip,
  icon,
  onClick,
  gradientClass,
}: {
  tooltip: string;
  icon: React.ReactNode;
  onClick?: () => void;
  gradientClass: string;
}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          size="icon"
          variant="ghost"
          className="hover:scale-110 focus-visible:ring-2 focus-visible:ring-offset-2 transition-all duration-150"
          onClick={onClick}
        >
          <span
            className={`inline-block ${gradientClass} bg-clip-text text-transparent drop-shadow-sm`}
          >
            {icon}
          </span>
        </Button>
      </TooltipTrigger>
      <TooltipContent className="text-xs font-medium">{tooltip}</TooltipContent>
    </Tooltip>
  );
}
