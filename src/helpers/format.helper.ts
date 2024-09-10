export class DataFormatterHelper {

    static formatPhoneNumbers(phoneNumbers: string[], customerId?: string, marketId?: string): { number: string, isPrimary: boolean, customerId?: string, marketId?: string }[] {
        return phoneNumbers.map((number, index) => {
            return {
                number,
                isPrimary: index === 0,
                customerId,
                marketId
            }
        });
    }

    static formatDate(date: string | Date): Date {
        return new Date(date);
    }

    static formatDatabaseObject(data: { [key: string]: any }, id?: "id"): void {
        delete data.createdAt;
        delete data.updatedAt;
        delete data.deletedAt;
        if (id) {
            delete data.id;
        }
    }
}