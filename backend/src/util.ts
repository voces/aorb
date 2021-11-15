export const formatList = (list: (string | { toString: () => string })[]) => {
  if (list.length === 0) throw new Error("Expected non-empty list");
  if (list.length === 1) return list[0];
  return `${list.slice(0, -1).join(", ")} or ${list[list.length - 1]}`;
};
