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

//
// // Example usage with proper typing
// interface Config {
//   theme: {
//     colors: {
//       primary: string;
//       secondary: string;
//     };
//     spacing: {
//       small: number;
//       medium: number;
//     };
//   };
//   features: {
//     enableA: boolean;
//   };
// }
//
// const baseConfig: Config = {
//   theme: {
//     colors: {
//       primary: "#000",
//       secondary: "#fff",
//     },
//     spacing: {
//       small: 4,
//       medium: 8,
//     },
//   },
//   features: {
//     enableA: true,
//   },
// };
//
// const overrideConfig: DeepPartial<Config> = {
//   theme: {
//     colors: {
//       primary: "#123",
//     },
//   },
// };
//
// const mergedConfig = deepMerge(baseConfig, overrideConfig);
// console.log("Merged config:", JSON.stringify(mergedConfig, null, 2));
