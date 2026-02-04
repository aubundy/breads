export function validateZipCode(value) {
  const isEmpty = (value) => value === "";
  const isOnlyDigits = (value) => /^[0-9]+$/.test(value);
  const isCorrectLength = (value) => /^\d{5}$/.test(value);

  if (isEmpty(value)) return "Zip Code is required";
  if (!isOnlyDigits(value)) return "Zip Code must contain only digits";
  if (!isCorrectLength(value)) return "Zip Code must be 5 digits";
  return null;
}
