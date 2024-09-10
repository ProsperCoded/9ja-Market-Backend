import { Customer } from "@prisma/client";

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

    static formatCustomer(customer: Customer) {
        return {
            id: customer.id,
            firstName: customer.firstName,
            lastName: customer.lastName,
            email: customer.email,
            emailVerifiedAt: customer.emailVerifiedAt,
            displayImage: customer.displayImage,
        }
    }
}