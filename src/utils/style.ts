// Utility function to generate CSS classes from strings
export const c = (
  strings: TemplateStringsArray,
  ...values: any[]
): string[] => {
  return strings.join("").split(/\s+/).filter(Boolean);
};
