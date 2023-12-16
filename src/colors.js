export const colorsBg = {
  primary:
    "bg-gradient-to-r from-primary-600 to-primary-500 text-white transition hover:shadow-default hover:shadow-primary-900",
  secondary: "bg-gradient-to-r from-secondary-500 to-secondary-400 text-white",
  gray: "bg-gradient-to-r from-gray-800 to-gray-700 text-white",
  red: "bg-gradient-to-r from-red-800 to-red-700 text-white",
  black: "bg-gradient-to-r from-tertiary-900 to-tertiary-800 text-primary-900",
};

export const colorsBgHover = {
  primary: "bg-gradient-to-r from-primary-900 to-primary-700 text-white",
  secondary: "bg-gradient-to-r from-secondary-900 to-secondary-700",
  gray: "bg-gradient-to-r from-gray-900 to-gray-800",
  red: "bg-gradient-to-r from-red-900 to-red-800",
  black: "bg-gradient-to-r from-black to-tertiary-300",
};

export const colorsBorders = {
  primary: "border-primary-900 shadow-default shadow-primary-900",
  secondary: "border-secondary-700 shadow-default shadow-secondary-700",
  gray: "border-gray-900 shadow-default shadow-gray-900",
  red: "border-red-800 shadow-default shadow-red-800",
  black: "border-black shadow-default shadow-black",
  white: "border-white shadow-default shadow-white",
};

export const colorsText = {
  primary: "text-primary-900",
  secondary: "text-secondary-700",
  gray: "text-white",
  red: "text-white",
  black: "text-primary-900",
  white: "text-white",
};

export const colorsOutlineHover = {
  primary: "hover:bg-primary-700 hover:text-white border-2 border-primary-700",
  secondary:
    "hover:bg-secondary-700 hover:text-white border-2 border-secondary-700",
  gray: "hover:bg-gray-900 hover:text-white border-2 border-gray-900",
  red: "hover:bg-red-800 hover:text-white border-2 border-red-800",
  white: "hover:bg-white hover:text-black border-2 border-white",
  black: "hover:bg-black border-2 border-black",
};

export const getButtonColor = (color, isOutlined, hasHover, textColor) => {
  const base = [
    textColor
      ? "text-" + textColor
      : isOutlined
      ? colorsText[color]
      : colorsBg[color],
    colorsBorders[color],
  ];

  if (hasHover) {
    base.push(isOutlined ? colorsOutlineHover[color] : "");
  }

  return base;
};

export const getButtonHoverColor = (color, isOutlined) => {
  const base = [isOutlined ? "" : colorsBgHover[color]];

  return base;
};
