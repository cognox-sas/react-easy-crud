const resolveValue = (key, record, getValue, defaultValue) => {
  if (typeof getValue === 'function') {
    return getValue(record) || defaultValue;
  }
  return record[key] || defaultValue;
};

export const sortString = (key, getValue) => (a, b) =>
  resolveValue(key, a, getValue, '').localeCompare(
    resolveValue(key, b, getValue, '')
  );
export const sortNumber = (key, getValue) => (a, b) =>
  resolveValue(key, a, getValue) - resolveValue(key, b, getValue);
export const sortBool = (key, getValue) => (a, b) =>
  resolveValue(key, b, getValue, false) - resolveValue(key, a, getValue, false);

export const response = `
  message
  status
  result`;
