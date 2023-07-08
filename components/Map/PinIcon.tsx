import React, { useState } from "react";

const ICON_WIDTH = 50;

const style = {
  position: "absolute",
  width: ICON_WIDTH,
  height: ICON_WIDTH,
  left: -ICON_WIDTH / 2,
  top: -ICON_WIDTH,
  filter: "drop-shadow(3px 5px 2px rgb(0 0 0 / 0.4))",
  transition: "transform 0.2s ease-out",
};

const PinIcon = () => {
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const scale = isHovered ? 1.2 : 1;

  return (
    <img
      src="/images/Map_Pin.svg"
      alt="PinIcon"
      style={{ ...style, transform: `scale(${scale})` }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    />
  );
};

export default PinIcon;
