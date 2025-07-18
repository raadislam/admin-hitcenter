import { useRef, useState } from "react";

type CustomTooltipProps = {
  content: React.ReactNode;
  children: React.ReactNode;
  delayShow?: number;
  delayHide?: number;
  className?: string;
};

export function CustomTooltip({
  content,
  children,
  delayShow = 150,
  delayHide = 100,
  className = "",
}: CustomTooltipProps) {
  const [visible, setVisible] = useState(false);
  const timeoutShow = useRef<NodeJS.Timeout>();
  const timeoutHide = useRef<NodeJS.Timeout>();

  const show = () => {
    clearTimeout(timeoutHide.current);
    timeoutShow.current = setTimeout(() => setVisible(true), delayShow);
  };

  const hide = () => {
    clearTimeout(timeoutShow.current);
    timeoutHide.current = setTimeout(() => setVisible(false), delayHide);
  };

  const triggerProps = {
    onMouseEnter: show,
    onMouseLeave: hide,
    onFocus: show,
    onBlur: hide,
    tabIndex: 0,
    "aria-describedby": visible ? "tooltip" : undefined,
    className: "focus:outline-none",
  };

  return (
    <span className="relative inline-block">
      <span {...triggerProps}>{children}</span>
      {visible && (
        <div
          className="absolute z-50 left-1/2 bottom-full mb-2 px-3 py-1.5 rounded-lg bg-black bg-opacity-80 text-white text-xs font-medium pointer-events-none whitespace-nowrap shadow-lg animate-fadeIn"
          style={{ transform: "translateX(-50%)" }}
        >
          {content}
          {/* Arrow after content */}
          <span className="absolute left-1/2 -translate-x-1/2 top-full w-3 h-3 bg-black bg-opacity-80 rotate-45 mt-[-8px]" />
        </div>
      )}
    </span>
  );
}
