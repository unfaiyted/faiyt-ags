import Pango from "gi://Pango";

export const getFontWeightName = (weight: Pango.Weight) => {
  switch (weight) {
    case Pango.Weight.ULTRALIGHT:
      return "UltraLight";
    case Pango.Weight.LIGHT:
      return "Light";
    case Pango.Weight.NORMAL:
      return "Normal";
    case Pango.Weight.BOLD:
      return "Bold";
    case Pango.Weight.ULTRABOLD:
      return "UltraBold";
    case Pango.Weight.HEAVY:
      return "Heavy";
    default:
      return "Normal";
  }
};
