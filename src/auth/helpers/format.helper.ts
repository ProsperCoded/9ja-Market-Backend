
export class DataFormatterHelper {

    static formatPhoneNumbers(phoneNumbers: string[]): { number: string, isPrimary: boolean }[] {
        return phoneNumbers.map((number, index) => {
            return {
                number,
                isPrimary: index === 0
            }
        });
    }
}