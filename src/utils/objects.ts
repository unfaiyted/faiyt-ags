type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export function deepMerge<T extends object>(
  target: T,
  source: DeepPartial<T>,
): T {
  const output = { ...target };

  if (!source) {
    return output;
  }

  Object.keys(source).forEach((key) => {
    const sourceValue = source[key as keyof typeof source];
    const targetValue = output[key as keyof T];

    if (isObject(targetValue) && isObject(sourceValue)) {
      output[key as keyof T] = deepMerge(
        targetValue,
        sourceValue as DeepPartial<typeof targetValue>,
      );
    } else if (sourceValue !== undefined) {
      output[key as keyof T] = sourceValue as T[keyof T];
    }
  });

  return output;
}

function isObject(item: unknown): item is Record<string, any> {
  return Boolean(item && typeof item === "object" && !Array.isArray(item));
}
