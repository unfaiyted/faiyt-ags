export const mix = (value1: number, value2: number, perc: number) => {
  return value1 * perc + value2 * (1 - perc);
};
