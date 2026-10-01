export function serializeLogValue(value: unknown): string | undefined {
  return JSON.stringify(
    value,
    (_key: string, nestedValue: unknown): unknown => {
      if (nestedValue instanceof Error) {
        return {
          ...nestedValue,
          name: nestedValue.name,
          message: nestedValue.message,
          stack: nestedValue.stack,
        };
      }

      return nestedValue;
    },
  );
}
