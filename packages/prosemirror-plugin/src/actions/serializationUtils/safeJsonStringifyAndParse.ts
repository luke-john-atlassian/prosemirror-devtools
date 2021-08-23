export function safeJsonStringifyAndParse(
  original: any,
  indent = 2,
  limit: number | undefined = undefined
) {
  let cache: any[] = [];
  let valueCount = 0;

  if (typeof original === "function") {
    return;
  }

  const stringified = JSON.stringify(
    original,
    (key, value) => {
      if (limit) {
        if (valueCount === limit) {
          return undefined; // Limit reached, discard key
        } else {
          valueCount = valueCount + 1;
        }
      }
      if (typeof value === "object" && value !== null) {
        if (cache.includes(value)) {
          return undefined; // Duplicate reference found, discard key
        } else {
          cache.push(value) && value; // Store value in our collection
        }

        if ("toJSON" in value) {
          const { toJSON, ...valueWithoutToJSON } = value;

          return valueWithoutToJSON;
        }
      }

      return value;
    },
    indent
  );

  const parsed = JSON.parse(stringified);

  return parsed;
}
