
/**
 * Converts English digits in a number or string to Persian digits.
 * This function uses a regular expression and a direct character mapping for optimal performance.
 *
 * @param {string | number} input - The input string or number containing English digits to convert.
 * @returns {string} - The input with English digits converted to Persian digits.
 */
export const convertToPersianNumbers = (input: string | number): string => {
  // Convert the input to a string to ensure we can work with it.
  const inputStr = input?.toString();

  // Use a regular expression to replace English digits with Persian digits.
  return inputStr?.replace(/\d/g, (char) =>
    String.fromCharCode(char.charCodeAt(0) + 1728)
  );
};