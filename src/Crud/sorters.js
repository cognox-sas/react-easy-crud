export const sortString = (key, keyObject = 'name') => (a, b) => {
  if (
    (a[key] && typeof a[key] === 'object') ||
    (b[key] && typeof b[key] === 'object')
  ) {
    const valueA = a[key] && a[key][keyObject];
    const valueB = b[key] && b[key][keyObject];
    return (valueA || '').localeCompare(valueB || '');
  }
  return (a[key] || '').localeCompare(b[key] || '');
};
export const sortNumber = key => (a, b) => a[key] - b[key];
export const sortBool = key => (a, b) => b[key] - a[key];
export const response = `
  message
  status
  result`;
