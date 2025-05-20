
/**
 * Password strength calculation and validation utilities
 */

interface PasswordStrengthResult {
  score: number; // 0-4 score (0: very weak, 4: very strong)
  feedback: string[]; // Feedback messages
  isStrong: boolean; // Whether the password meets minimum requirements
  hasUppercase: boolean;
  hasLowercase: boolean;
  hasNumbers: boolean;
  hasSpecialChars: boolean;
  isLongEnough: boolean;
  estimatedCrackTime: string; // Human-readable estimated time to crack
}

/**
 * Calculate password entropy in bits
 * Higher entropy means more secure password
 */
const calculateEntropy = (password: string): number => {
  // Character set sizes
  const uppercaseSize = /[A-Z]/.test(password) ? 26 : 0;
  const lowercaseSize = /[a-z]/.test(password) ? 26 : 0;
  const numberSize = /[0-9]/.test(password) ? 10 : 0;
  const specialSize = /[^A-Za-z0-9]/.test(password) ? 33 : 0; // Approximation
  
  // Calculate character pool size
  const poolSize = uppercaseSize + lowercaseSize + numberSize + specialSize;
  
  // Calculate entropy
  if (poolSize === 0) return 0; // Edge case
  return Math.log2(Math.pow(poolSize, password.length));
};

/**
 * Estimate time to crack the password
 * Based on 10 billion guesses per second (high-end hardware)
 */
const estimateCrackTime = (entropy: number): string => {
  // Possible combinations = 2^entropy
  // Time = combinations / guesses per second
  const combinations = Math.pow(2, entropy);
  const secondsToCrack = combinations / 10000000000;
  
  // Convert to appropriate unit
  if (secondsToCrack < 60) {
    return `${Math.round(secondsToCrack)} seconds`;
  } else if (secondsToCrack < 3600) {
    return `${Math.round(secondsToCrack / 60)} minutes`;
  } else if (secondsToCrack < 86400) {
    return `${Math.round(secondsToCrack / 3600)} hours`;
  } else if (secondsToCrack < 31536000) {
    return `${Math.round(secondsToCrack / 86400)} days`;
  } else if (secondsToCrack < 31536000 * 100) {
    return `${Math.round(secondsToCrack / 31536000)} years`;
  } else if (secondsToCrack < 31536000 * 1000) {
    return `${Math.round(secondsToCrack / 31536000 / 100)} centuries`;
  } else {
    return `${Math.round(secondsToCrack / 31536000 / 1000)} millennia`;
  }
};

/**
 * Check for common passwords
 */
const isCommonPassword = (password: string): boolean => {
  const commonPasswords = [
    'password', '123456', '123456789', 'qwerty', '12345', '12345678',
    'football', 'baseball', 'welcome', 'admin', 'abc123', 'letmein',
    'monkey', '111111', 'password1', 'qwerty123', '123123', 'dragon',
    'baseball', 'football', 'soccer', 'monkey', 'abc123', 'master'
  ];
  
  return commonPasswords.includes(password.toLowerCase());
};

/**
 * Check for keyboard patterns
 */
const hasKeyboardPattern = (password: string): boolean => {
  const patterns = [
    'qwerty', 'asdfgh', 'zxcvbn', '123456', 'qwertyuiop',
    'asdfghjkl', 'zxcvbnm', 'qazwsx', 'qazwsxedc'
  ];
  
  for (const pattern of patterns) {
    if (password.toLowerCase().includes(pattern)) {
      return true;
    }
  }
  
  return false;
};

/**
 * Check for repeated characters
 */
const hasRepeatedChars = (password: string): boolean => {
  return /(.)\1{2,}/.test(password); // Check for 3+ repeated characters
};

/**
 * Analyze password strength
 */
export const checkPasswordStrength = (password: string): PasswordStrengthResult => {
  // Check requirements
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumbers = /[0-9]/.test(password);
  const hasSpecialChars = /[^A-Za-z0-9]/.test(password);
  const isLongEnough = password.length >= 8;
  
  // Calculate entropy-based score
  const entropy = calculateEntropy(password);
  
  // Initial score based on entropy
  let score = 0;
  if (entropy > 80) score = 4;
  else if (entropy > 60) score = 3;
  else if (entropy > 40) score = 2;
  else if (entropy > 20) score = 1;
  
  // Penalty modifiers
  if (isCommonPassword(password)) score = Math.max(0, score - 2);
  if (hasKeyboardPattern(password)) score = Math.max(0, score - 1);
  if (hasRepeatedChars(password)) score = Math.max(0, score - 1);
  
  // Bonus modifiers
  if (hasUppercase && hasLowercase && hasNumbers && hasSpecialChars) score = Math.min(4, score + 1);
  if (password.length > 12) score = Math.min(4, score + 1);
  
  // Generate feedback messages
  const feedback = [];
  
  if (!isLongEnough) feedback.push('Use at least 8 characters');
  if (!hasUppercase) feedback.push('Add uppercase letters');
  if (!hasLowercase) feedback.push('Add lowercase letters');
  if (!hasNumbers) feedback.push('Add numbers');
  if (!hasSpecialChars) feedback.push('Add special characters (like !@#$%)');
  if (isCommonPassword(password)) feedback.push('Avoid common passwords');
  if (hasKeyboardPattern(password)) feedback.push('Avoid keyboard patterns (like "qwerty")');
  if (hasRepeatedChars(password)) feedback.push('Avoid repeated characters');
  if (password.length < 12) feedback.push('Consider using a longer password');
  
  // Calculate estimated crack time
  const estimatedCrackTime = estimateCrackTime(entropy);
  
  // Determine if the password is considered strong enough
  const isStrong = score >= 3 && isLongEnough && 
    (hasUppercase && hasLowercase && hasNumbers || hasSpecialChars);
  
  return {
    score,
    feedback,
    isStrong,
    hasUppercase,
    hasLowercase,
    hasNumbers,
    hasSpecialChars,
    isLongEnough,
    estimatedCrackTime
  };
};

/**
 * Generate a secure random password
 */
export const generateSecurePassword = (length: number = 12): string => {
  const charset = {
    uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    lowercase: 'abcdefghijklmnopqrstuvwxyz',
    numbers: '0123456789',
    special: '!@#$%^&*()-_=+[]{}|;:,.<>?'
  };
  
  // Get a random character from a charset
  const getRandomChar = (chars: string): string => {
    const randomIndex = Math.floor(Math.random() * chars.length);
    return chars[randomIndex];
  };
  
  // Ensure at least one character from each set
  let password = 
    getRandomChar(charset.uppercase) +
    getRandomChar(charset.lowercase) +
    getRandomChar(charset.numbers) +
    getRandomChar(charset.special);
  
  // Fill the rest of the password length
  const allCharset = charset.uppercase + charset.lowercase + charset.numbers + charset.special;
  for (let i = 4; i < length; i++) {
    password += getRandomChar(allCharset);
  }
  
  // Shuffle the password characters
  return password.split('').sort(() => Math.random() - 0.5).join('');
};
