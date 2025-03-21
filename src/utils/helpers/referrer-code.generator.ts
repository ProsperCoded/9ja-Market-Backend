/**
 * Generates a random referrer code for marketers
 * @returns {string} A 6-8 character alphanumeric code
 */
export function generateReferrerCode(): string {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const length = Math.floor(Math.random() * 3) + 6; // Random length between 6-8
  let result = "";

  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }

  return result;
}
