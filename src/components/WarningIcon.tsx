
import React from "react";
import { motion } from "framer-motion";

interface WarningIconProps {
  size?: number;
  color?: string;
  className?: string;
  animated?: boolean;
}

const WarningIcon: React.FC<WarningIconProps> = ({ 
  size = 120, 
  color = "#FF3B30", 
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

  const exclamationVariants = {
    initial: { scaleY: 0, opacity: 0 },
    animate: { 
      scaleY: 1, 
      opacity: 1,
      transition: { 
        delay: 0.3,
        duration: 0.5,
        ease: "easeOut" 
      }
    }
  };

  const Component = animated ? motion.svg : "svg";
  const PathComponent = animated ? motion.path : "path";
  const CircleComponent = animated ? motion.circle : "circle";

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
        fill="rgba(255, 59, 48, 0.1)"
      />
      {animated ? (
        <>
          <PathComponent
            d="M12 8V12"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            variants={exclamationVariants}
          />
          <CircleComponent
            cx="12"
            cy="16"
            r="1"
            fill="white"
            variants={{
              initial: { opacity: 0 },
              animate: { 
                opacity: 1,
                transition: { delay: 0.8, duration: 0.3 }
              }
            }}
          />
        </>
      ) : (
        <>
          <path
            d="M12 8V12"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="12" cy="16" r="1" fill="white" />
        </>
      )}
    </Component>
  );
};

export default WarningIcon;
