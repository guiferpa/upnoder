/* eslint-disable */

export const normalizeMetadataKeys = (
  raw: Record<string, any>,
): Record<string, any> => {
  return Object.keys(raw).reduce((acc, key) => {
    const item = raw[key];
    const nkey = key.replace(/([A-Z])/g, "_$1").toLowerCase();
    return Object.assign(acc, {
      [nkey]: item instanceof Object ? normalizeMetadataKeys(item) : item,
    });
  }, {});
};
