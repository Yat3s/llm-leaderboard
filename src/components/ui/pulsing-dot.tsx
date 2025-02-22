interface PulsingDotProps {
  className?: string;
  dotColor?: string;
  pulseColor?: string;
  size?: string;
  duration?: string;
}

export const PulsingDot = ({
  className = "",
  dotColor = "bg-sky-500",
  pulseColor = "bg-sky-400",
  size = "h-2 w-2",
  duration = "2s",
}: PulsingDotProps) => {
  return (
    <span className={`pulsing-dot-container ${size} ${className}`}>
      <span className={`pulsing-dot-wrapper ${size}`}>
        <span
          className={`pulsing-dot-pulse ${pulseColor}`}
          style={{ animationDuration: duration }}
        ></span>
        <span className={`pulsing-dot ${size} ${dotColor}`}></span>
      </span>
    </span>
  );
};
