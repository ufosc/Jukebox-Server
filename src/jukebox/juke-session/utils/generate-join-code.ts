export const JOIN_CODE_LENGTH = 6

/**
 * Generates an alphanumeric join code
 * @param len Length of the desired join code
 * @returns Join code string
 */
export function generateJoinCode(len: number = JOIN_CODE_LENGTH): string {
    const CHARACTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890"

    let result = "";

    for (let i = 0; i < len; i++) {
        const randomIndex = Math.floor(Math.random() * CHARACTERS.length);
        result += CHARACTERS[randomIndex];
    }

    return result;
}
