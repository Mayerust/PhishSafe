
import React from "react";
import { motion } from "framer-motion";

interface ShieldIconProps {
  size?: number;
  color?: string;
  className?: string;
  animated?: boolean;
}

const ShieldIcon: React.FC<ShieldIconProps> = ({ 
  size = 120, 
  color = "#007AFF", 
  className = "",
  animated = true
}) => {
  const shieldVariants = {
    initial: { scale: 0.9, opacity: 0 },
    animate: { 
      scale: 1, 
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

  const checkVariants = {
    initial: { pathLength: 0, opacity: 0 },
    animate: { 
      pathLength: 1, 
      opacity: 1,
      transition: { 
        delay: 0.3,
        duration: 0.8,
        ease: "easeInOut" 
      }
    }
  };

  const Component = animated ? motion.svg : "svg";
  const PathComponent = animated ? motion.path : "path";

  return (
    <Component
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${className} ${animated ? "animate-shield-pulse" : ""}`}
      variants={animated ? shieldVariants : undefined}
      initial={animated ? "initial" : undefined}
      animate={animated ? "animate" : undefined}
    >
      <PathComponent
        d="M12 22C12 22 20 18 20 12V5L12 2L4 5V12C4 18 12 22 12 22Z"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="rgba(0, 122, 255, 0.1)"
      />
      {!animated ? (
        <path
          d="M9 12L11 14L15 10"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ) : (
        <PathComponent
          d="M9 12L11 14L15 10"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          variants={checkVariants}
          initial="initial"
          animate="animate"
        />
      )}
    </Component>
  );
};

export default ShieldIcon;
