/**
 * Utility functions for generating random test data
 */

/**
 * Generates a random string with letters and numbers only
 * @param length - Length of the string to generate
 * @param includeSpaces - Whether to include spaces (default: true)
 */
export function generateRandomString(length: number, includeSpaces: boolean = true): string {
  const letters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const numbers = '0123456789';
  const space = ' ';
  
  const chars = includeSpaces ? letters + numbers + space : letters + numbers;
  
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  
  // Trim spaces from start and end
  return result.trim();
}

/**
 * Generates a random description with special characters allowed
 * @param minLength - Minimum length (default: 10)
 * @param maxLength - Maximum length (default: 50)
 */
export function generateRandomDescription(minLength: number = 10, maxLength: number = 50): string {
  const length = Math.floor(Math.random() * (maxLength - minLength + 1)) + minLength;
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789 .,!?-';
  
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  
  return result.trim();
}

/**
 * Generates random work group data
 */
export function generateWorkGroupData() {
  const timestamp = Date.now();
  
  return {
    name: `WG ${generateRandomString(8, true)}`,
    description: generateRandomDescription(15, 40),
    code: `Code${generateRandomString(6, false)}`,
    siteName: `Site${generateRandomString(8, false)}`
  };
}

/**
 * Generates a random alphanumeric code without spaces
 * @param length - Length of the code (default: 8)
 */
export function generateCode(length: number = 8): string {
  return generateRandomString(length, false);
}

/**
 * Generates a random site name without spaces
 * @param length - Length of the site name (default: 10)
 */
export function generateSiteName(length: number = 10): string {
  return generateRandomString(length, false);
}

/**
 * Generates a random name with spaces allowed
 * @param minLength - Minimum length (default: 5)
 * @param maxLength - Maximum length (default: 20)
 */
export function generateName(minLength: number = 5, maxLength: number = 20): string {
  const length = Math.floor(Math.random() * (maxLength - minLength + 1)) + minLength;
  return generateRandomString(length, true);
}
